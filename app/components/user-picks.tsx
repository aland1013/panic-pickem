import { useEffect, useState } from 'react'
import { Form } from '@remix-run/react'
import dayjs from 'dayjs'

import CountdownTimer from '~/components/countdown-timer'
import SongSelect from '~/components/song-select'
import { useEntry, usePrevShowSongIds, useShow, useSongs } from '~/utils/data'
import { NUM_PICKS } from '~/utils/constant'
import SongFilter from './song-filter'
import { classNames } from '~/utils/string'
import twitter_logo from '~/twitter_logo.png'

const UserPicks = () => {
  const {
    contest: { id: contestId },
    date
  } = useShow()
  const prevShowSongIds = usePrevShowSongIds()
  const entry = useEntry()
  const songs = useSongs()

  const [showEntry, setShowEntry] = useState(Boolean(entry?.picks))
  const defaultPicks = new Array(NUM_PICKS)
    .fill({})
    .map((p, i) => ({ confidencePoints: NUM_PICKS - i }))
  const [picks, setPicks] = useState<Song[]>(entry?.picks || defaultPicks)
  const [filters, setFilters] = useState([
    { value: 'original', label: 'original', checked: false },
    { value: 'cover', label: 'cover', checked: false },
    { value: 'bustout', label: 'bustout', checked: false }
  ])

  const [sortOptions, setSortOptions] = useState([
    { name: 'a-z', current: true },
    { name: 'z-a', current: false },
    { name: 'times played', current: false },
    { name: 'last time played', current: false }
  ])

  const initialEditPick = {}
  for (let i = 0; i < NUM_PICKS; i++) {
    initialEditPick[i] = false
  }

  const [editPick, setEditPick] = useState(initialEditPick)
  const [editPending, setEditPending] = useState(false)

  useEffect(() => {
    if (entry?.picks) {
      setShowEntry(true)
      setPicks(entry.picks)
      setEditPick(initialEditPick)
      setEditPending(false)
    }
  }, [entry])

  const handleEditPicks = () => {
    setShowEntry(false)
  }

  const handlePick = (index: number, selectedSong: Song) => {
    if (selectedSong) {
      const existingIndex = picks.map(p => p.song?.id).indexOf(selectedSong.id)
      if (existingIndex < 0) {
        setPicks(prev =>
          prev.map((p, i) =>
            i === index
              ? {
                  id: `${selectedSong.id}-${p.confidencePoints}`,
                  confidencePoints: p.confidencePoints,
                  song: selectedSong
                }
              : p
          )
        )
      } else {
        setPicks(prev =>
          prev.map((p, i, arr) =>
            i === index
              ? {
                  id: `${selectedSong.id}-${p.confidencePoints}`,
                  confidencePoints: p.confidencePoints,
                  song: selectedSong
                }
              : i === existingIndex
              ? {
                  id: `${arr[index].song.id}-${p.confidencePoints}`,
                  confidencePoints: p.confidencePoints,
                  song: arr[index].song
                }
              : p
          )
        )
      }
    }

    const newEditPick = editPick
    newEditPick[index] = false
    setEditPick(newEditPick)
    setEditPending(Object.values(newEditPick).includes(true))
  }

  const handleTimesButtonClick = (e, editingIndex) => {
    e.preventDefault()

    setEditPending(true)

    setEditPick(prev => ({ ...prev, [editingIndex]: true }))
  }

  const handleCancel = e => {
    setShowEntry(Boolean(entry?.picks))
    setPicks(entry?.picks || defaultPicks)
    setEditPick(initialEditPick)
    setEditPending(false)
  }

  const handleFilterChange = index => {
    const newFilters = filters.map((f, i) => {
      if (i === index) {
        return { ...f, checked: !f.checked }
      } else return f
    })

    setFilters(newFilters)
  }

  const handleSortChange = index => {
    const newSortOptions = sortOptions.map((s, i) => {
      if (i === index) {
        return { ...s, current: true }
      } else {
        return { ...s, current: false }
      }
    })

    setSortOptions(newSortOptions)
  }

  const picksMade = picks.filter(p => !!p.id).length
  const picksComplete = picksMade === NUM_PICKS

  const tweet = `#PanicPick5 - ${dayjs(date).format('M/DD/YYYY')}\n\n${picks
    .map(p => `${p?.song?.title}`)
    .join('\n')}\n\nhttps://panic-pickem.fly.dev`
  const encodedTweet = encodeURIComponent(tweet)

  return (
    <>
      <CountdownTimer date={date} />
      <div className='flex flex-col text-medium text-sm text-center pb-4'>
        <div>pick {NUM_PICKS} songs from most- to least-confident</div>
        <div>
          each pick is assigned a corresponding point value ({NUM_PICKS}-1)
        </div>
        <div className='flex flex-wrap items-center justify-center'>
          <div className='pr-2'>song list is color-coded: </div>
          <div className='flex items-center justify-center'>
            <div className='mr-2 h-1 w-1 rounded-full bg-red-700' />
            <div className='mr-4 text-red-700'>last show</div>
          </div>
          <div className='flex items-center justify-center'>
            <div className='mr-2 h-1 w-1 rounded-full bg-blue-700' />
            <div className='mr-4 text-blue-700'>2 shows ago</div>
          </div>
          <div className='flex items-center justify-center'>
            <div className='mr-2 h-1 w-1 rounded-full bg-purple-700' />
            <div className='mr-4 text-purple-700'>3 shows ago</div>
          </div>
        </div>
        <div className='text-white py-1 mt-2'>
          ** BUSTOUT BONUS: +5 points if song not played in 100+ shows **
        </div>
      </div>
      {showEntry ? (
        <>
          <table className='w-full md:w-[420px] border border-primary-dark mx-auto mb-4'>
            <tbody>
              <tr>
                <th colSpan={2} className='border-y border-primary-dark py-1'>
                  {entry?.user.username}'s picks
                </th>
              </tr>
              {entry?.picks.map((p, index) => (
                <tr key={p.id}>
                  <td className='py-1 pl-4 pr-2 border border-primary-dark'>
                    {p.song.title}
                  </td>
                  <td className='w-10 border border-primary-dark text-center'>
                    {p.confidencePoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='w-full flex justify-center space-x-2'>
            <button className='button' onClick={handleEditPicks}>
              edit picks
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedTweet}`}
              target='_blank'
              rel='noreferrer'
              className='button'
            >
              <img
                src={twitter_logo}
                className='inline w-6 pr-2'
                alt='twitter logo'
              />
              #PanicPick5
            </a>
          </div>
        </>
      ) : (
        <Form
          method='post'
          autoComplete='off'
          className='w-full md:w-[480px] md:mx-auto flex flex-col items-center justify-center pb-4'
        >
          <input type='hidden' name='picks' value={picks.map(p => p.id)} />
          <input
            type='hidden'
            name='existingPicks'
            value={entry?.picks?.map(p => p.id)}
          />
          <input type='hidden' name='contestId' value={contestId} />
          <div className='w-full mx-auto md:w-[480px] flex flex-col items-start justify-center -space-y-px pb-0'>
            <SongFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              sortOptions={sortOptions}
              onSortChange={handleSortChange}
              hidden={!editPending && entry}
            />

            {picks.map((p, index) =>
              p.id ? (
                <div
                  key={p.id}
                  className={classNames(
                    editPick[index] ? 'pr-2 pl-1' : 'p-2 pl-4',
                    'border border-primary-dark w-full flex items-center justify-between'
                  )}
                >
                  {editPick[index] ? (
                    <SongSelect
                      songs={songs}
                      onPick={handlePick}
                      autofocusEnabled
                      filters={filters}
                      sortOptions={sortOptions}
                      index={index}
                      points={p.confidencePoints}
                      prevShowSongIds={prevShowSongIds}
                    />
                  ) : (
                    <>
                      <span className=''>{p.song.title}</span>
                      <div className='flex space-x-3'>
                        <span className='w-24 text-right'>{`[${
                          p.confidencePoints
                        } ${p.confidencePoints > 1 ? 'pts.' : 'pt.'}]`}</span>
                        {picks.length === NUM_PICKS ? (
                          <button
                            className='hover:text-primary-light'
                            onClick={e => handleTimesButtonClick(e, index)}
                            // disabled={editPending}
                          >
                            x
                          </button>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>
              ) : null
            )}
            {!picksComplete ? (
              <div className='border border-primary-dark w-full flex items-center justify-between pr-3'>
                <SongSelect
                  songs={songs}
                  onPick={handlePick}
                  autofocusEnabled
                  filters={filters}
                  sortOptions={sortOptions}
                  index={picksMade}
                  points={picks[picksMade].confidencePoints}
                  prevShowSongIds={prevShowSongIds}
                />
              </div>
            ) : null}
            <div className='w-full flex justify-center space-x-2 pt-4 pb-2'>
              {picksComplete ? (
                <button className='button' type='submit' disabled={editPending}>
                  submit
                </button>
              ) : null}
              <button className='button' type='button' onClick={handleCancel}>
                cancel
              </button>
            </div>
          </div>
        </Form>
      )}
    </>
  )
}

export default UserPicks
