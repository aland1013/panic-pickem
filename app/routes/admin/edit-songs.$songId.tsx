import type { LoaderFunction } from '@remix-run/node'
import type { Song } from '@prisma/client'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { json } from '@remix-run/node'
import { useLoaderData, useActionData, Form, Link } from '@remix-run/react'
import { requireAdminUserSession } from '~/utils/session.server'
import { getSongId, getSong } from '~/utils/song'

import { db } from '~/utils/db.server'

dayjs.extend(utc)

interface LoaderData {
  song: Song
}

export const loader: LoaderFunction = async ({
  params,
  request
}: {
  params: { songId: string }
  request: Request
}) => {
  await requireAdminUserSession(request)
  const songId = await getSongId(params)
  const song = await getSong(songId)

  const data: LoaderData = { song }
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  await requireAdminUserSession(request)
  const form = await request.formData()
  const songId = Number(form.get('songId'))
  const title = form.get('title')
  const original = Boolean(form.get('original'))
  const timesPlayed = Number(form.get('timesPlayed'))
  const lastTimePlayed = new Date(form.get('lastTimePlayed'))

  try {
    await db.song.update({
      where: { id: songId },
      data: {
        title,
        original,
        timesPlayed,
        lastTimePlayed
      }
    })

    return true
  } catch (e) {
    console.log({ e })
  }
}

const EditSongRoute = () => {
  const { song } = useLoaderData<LoaderData>()
  const isSuccess = useActionData<Boolean>()

  return (
    <Form method='POST'>
      <input type='hidden' name='songId' value={song.id} />
      <div className='container mx-auto flex flex-col items-center space-y-4'>
        <div className='flex items-center space-x-4'>
          <label className='flex items-center space-x-2'>
            <div>title:</div>
            <input
              name='title'
              size={40}
              defaultValue={song.title}
              className='border border-primary-dark pl-2 py-1'
            />
          </label>
          <label className='flex items-center space-x-2'>
            <div>original:</div>
            <div className='flex items-center'>
              <input
                name='original'
                type='checkbox'
                defaultChecked={song.original}
              />
              <div className='checkbox' />
            </div>
          </label>
        </div>
        <div className='flex items-center space-x-4'>
          <label className='flex items-center space-x-2'>
            <div>times played:</div>
            <input
              name='timesPlayed'
              type='number'
              defaultValue={song.timesPlayed}
              className='w-16 text-center border border-primary-dark py-1'
            />
          </label>
          <label className='flex items-center space-x-2'>
            <div>last time played:</div>
            <input
              name='lastTimePlayed'
              type='date'
              defaultValue={dayjs.utc(song.lastTimePlayed).format('YYYY-MM-DD')}
              className='border border-primary-dark px-2 py-1'
            />
          </label>
        </div>
        <div className='flex space-x-4'>
          <button type='submit' className='button'>
            update
          </button>
          <Link to='/admin/edit-songs' className='button'>
            cancel
          </Link>
        </div>
        {isSuccess ? (
          <div className='text-high'>successfully updated song</div>
        ) : null}
      </div>
    </Form>
  )
}

export default EditSongRoute
