import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import type { Show } from '@prisma/client'

import { json } from '@remix-run/node'
import { useLoaderData, useOutletContext, Form } from '@remix-run/react'
import { useState } from 'react'
import dayjs from 'dayjs'

import { db } from '~/utils/db.server'
import { requireAdminUserSession } from '~/utils/session.server'
import SongSelect from '~/components/song-select'
import { BUSTOUT_DATE } from '~/utils/constant'

interface LoaderData {
  show: Show
}

const getShowId = params => Number(params.showId)
const getShow = async showId =>
  await db.show.findUnique({
    where: { id: showId },
    include: {
      venue: true,
      contest: {
        include: {
          entries: {
            include: { user: true },
            orderBy: { score: 'desc' }
          }
        }
      },
      setlist: {
        include: {
          songs: { include: { song: true }, orderBy: { position: 'asc' } }
        }
      }
    }
  })

export const loader: LoaderFunction = async ({ params, request }) => {
  await requireAdminUserSession(request)
  const showId = await getShowId(params)
  const show = await getShow(showId)

  const data: LoaderData = { show }
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  await requireAdminUserSession(request)
  const form = await request.formData()
  const action = form.get('_action')
  if (action === 'cancel') return null

  const showId = Number(form.get('showId'))

  if (action === 'updatePsUrl') {
    const psUrl = form.get('psUrl')

    try {
      await db.show.update({
        where: { id: showId },
        data: { psUrl }
      })
    } catch (e) {
      console.log({ e })
    }
  }

  if (action === 'updateDate') {
    const date = form.get('date')
    try {
      await db.show.update({
        where: { id: showId },
        data: { date }
      })
    } catch (e) {
      console.log({ e })
    }
  }

  if (action === 'updateIsOver') {
    const isOver = Boolean(form.get('isOver'))
    try {
      await db.show.update({
        where: { id: showId },
        data: { isOver }
      })
    } catch (e) {
      console.log({ e })
    }
    return null
  }

  if (action === 'updateInfo') {
    const info = form.get('info')
    const existingInfo = form.get('existingInfo')

    if (info === existingInfo) {
      return null
    }

    try {
      await db.show.update({
        where: { id: showId },
        data: { info }
      })
    } catch (e) {
      console.log({ e })
    }
  }

  if (action === 'addSong') {
    const setNumber = Number(form.get('setNumber'))
    const setId = `${showId}-${setNumber}`

    const songId = Number(form.get('newSetSongId'))
    const position = Number(form.get('position'))
    const setSongId = `${songId}-${position}`

    try {
      await db.set.upsert({
        where: { id: setId },
        update: {
          songs: {
            connectOrCreate: {
              where: {
                id: setSongId
              },
              create: {
                id: setSongId,
                songId: songId,
                position
              }
            }
          }
        },
        create: {
          id: setId,
          showId,
          number: setNumber,
          songs: {
            connectOrCreate: {
              where: {
                id: setSongId
              },
              create: {
                id: setSongId,
                songId,
                position
              }
            }
          }
        }
      })

      const { id: contestId } = await db.contest.findFirst({
        where: { showId }
      })

      const picks = await db.pick.findMany({
        where: {
          songId,
          entries: {
            some: {
              contestId
            }
          }
        },
        include: {
          song: true
        }
      })

      for (let i = 0; i < picks.length; i++) {
        const pick = picks[i]
        const isBustout = dayjs(pick.song.lastTimePlayed).isBefore(BUSTOUT_DATE)
        let score = pick.confidencePoints
        if (isBustout) {
          await db.pick.update({
            where: { id: pick.id },
            data: { isBustout: true }
          })
          score += 5
        }

        await db.entry.updateMany({
          where: {
            contestId,
            picks: {
              some: {
                id: pick.id
              }
            }
          },
          data: {
            score: { increment: score }
          }
        })
      }

      const show = await getShow(showId)
      const d = dayjs(show.date).format('YYYY-MM-DD')

      await db.song.update({
        where: { id: songId },
        data: {
          lastTimePlayed: new Date(d),
          timesPlayed: { increment: 1 }
        }
      })
    } catch (e) {
      console.log({ e })
    }
  }

  return null
}

const EditShowRoute = () => {
  const { songs } = useOutletContext()
  const { show } = useLoaderData<LoaderData>()
  const { venue, date, setlist } = show
  const { name, city, state } = venue

  const formattedDate = dayjs(date).format('MMMM D, YYYY')

  const [selectedSong, setSelectedSong] = useState<Song>(null)

  return (
    <>
      <div className='text-center text-xl font-semibold pb-4'>edit show</div>
      <div className='flex flex-col items-center'>
        <div className='text-center text-xl font-semibold'>
          {name}, {city}, {state}
        </div>
        <div className='text-lg pb-4'>{formattedDate}</div>

        <Form method='post' autoComplete='off' className='w-full'>
          <input type='hidden' name='showId' value={show.id} />

          <div className='w-full flex flex-col justify-center space-y-4 pb-4'>
            <div className='flex items-center'>
              <label className='flex items-center pr-3'>
                <div className='pr-3'>psUrl:</div>
                <input
                  size={75}
                  name='psUrl'
                  defaultValue={show.psUrl}
                  className='border border-primary-dark pl-2 py-1'
                />
              </label>
              <button
                type='submit'
                name='_action'
                value='updatePsUrl'
                className='button'
              >
                update
              </button>
            </div>

            <div className='w-full flex items-center'>
              <label className='flex items-center pr-3'>
                <div className='pr-3'>date:</div>
                <input
                  size={24}
                  name='date'
                  defaultValue={show.date}
                  className='border border-primary-dark pl-2 py-1'
                />
              </label>
              <button
                type='submit'
                name='_action'
                value='updateDate'
                className='button'
              >
                update
              </button>
            </div>
          </div>
          <div className='w-full flex items-center pb-4'>
            <label className='flex items-center pr-3'>
              <div className='pr-3'>is over:</div>
              <div className='flex items-center'>
                <input
                  id='isOver'
                  name='isOver'
                  type='checkbox'
                  className='h-4 w-4 border border-primary-dark'
                  defaultChecked={show.isOver}
                />
                <div className='checkbox' />
              </div>
            </label>
            <button
              type='submit'
              name='_action'
              value='updateIsOver'
              className='button'
            >
              update
            </button>
          </div>
          <input
            type='hidden'
            name='newSetSongId'
            value={selectedSong?.id || ''}
          />
          {setlist.map(set => (
            <table key={set.id} className='border border-primary-dark mb-4'>
              <tbody>
                <tr>
                  <th colSpan={2} className='border-b border-primary-dark'>set {set.number}</th>
                </tr>
                <tr>
                  <th className='px-2 text-center border-b border-r border-primary-dark'>index</th>
                  <th className='px-2 text-center border-b border-primary-dark'>title</th>
                </tr>
                {set.songs.map(({ song }, i) => (
                  <tr key={song.id}>
                    <td className='px-2 text-center border-b border-r border-primary-dark'>{i}</td>
                    <td className='px-2 border-b border-primary-dark'>{song.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
          <div className='flex flex-col space-y-4 pb-4'>
            <div className='flex items-center'>
              <div className='w-full max-w-[480px] border border-primary-dark px-2 mr-3'>
                <SongSelect songs={songs} onPick={setSelectedSong} />
              </div>
            </div>
            <div className='w-full flex items-center'>
              <div className='pr-3'>add song:</div>
              <div>{selectedSong?.title}</div>
            </div>
            <div className='flex space-x-2'>
              <button
                type='submit'
                name='_action'
                value='addSong'
                className='button'
                disabled={!selectedSong}
                >
                confirm
              </button>
              <button
                type='submit'
                name='_action'
                value='cancel'
                className='button'
                onClick={() => setSelectedSong(null)}
                >
                cancel
              </button>
            </div>
            <input
              type='hidden'
              name='setNumber'
              value={setlist.length ? setlist.length - 1 : 0}
            />
            <input
              type='hidden'
              name='position'
              value={
                setlist.length
                  ? setlist[setlist.length - 1].songs?.length
                  : 0
              }
            />
          </div>
          <input type='hidden' name='existingInfo' value={show.info} />
          <textarea
            id='info-input'
            name='info'
            className='border border-primary-dark p-4 mb-2'
            rows={30}
            cols={60}
            defaultValue={show.info}
          />
          <div className='w-full flex justify-center space-x-2 pb-4'>
            <button
              type='submit'
              name='_action'
              value='updateInfo'
              className='button'
            >
              update info
            </button>
            <button
              type='submit'
              name='_action'
              value='cancel'
              className='button'
            >
              cancel
            </button>
          </div>
        </Form>
      </div>
    </>
  )
}

export default EditShowRoute
