import { useState, useEffect } from 'react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import dayjs from 'dayjs'

import { useAutoFocus } from '../utils/hooks'
import { classNames } from '../utils/string'
import { usePrevShowSongIds } from '~/utils/data'
import { BUSTOUT_DATE } from '~/utils/constant'

export default function SongSelect ({
  songs,
  onPick,
  autofocusEnabled = false,
  filters = null,
  sortOptions = null,
  index = null,
  points = null
}) {
  const [query, setQuery] = useState('')
  const [selectedSong, setSelectedSong] = useState<Song>(null)
  const songInput = useAutoFocus([selectedSong], autofocusEnabled)
  const prevShowSongIds = usePrevShowSongIds()

  useEffect(() => {
    const keyDownHandler = e => {
      if (selectedSong && e.key === 'Enter') {
        e.preventDefault()
        setQuery('')
        setSelectedSong(null)
        onPick && typeof index === 'number'
          ? onPick(index, selectedSong)
          : onPick(selectedSong)
      }
    }

    document.addEventListener('keydown', keyDownHandler)

    return () => document.removeEventListener('keydown', keyDownHandler)
  }, [selectedSong, onPick])

  let songlist = songs
  if (filters) {
    const filtersOn = filters.filter(f => f.checked).map(f => f.value)

    if (filtersOn.includes('bustout')) {
      songlist = songlist.filter(s =>
        dayjs(s.lastTimePlayed).isBefore(dayjs(BUSTOUT_DATE))
      )
    }

    if (filtersOn.length >= 1 && filtersOn.length < 3) {
      if (
        (filtersOn.length === 1 && filtersOn.includes('original')) ||
        (filtersOn.length === 2 && !filtersOn.includes('cover'))
      ) {
        songlist = songlist.filter(s => s.original)
      }
      if (
        (filtersOn.length === 1 && filtersOn.includes('cover')) ||
        (filtersOn.length === 2 && !filtersOn.includes('original'))
      ) {
        songlist = songlist.filter(s => !s.original)
      }
    }
  }

  const filteredSongs =
    query === ''
      ? songlist
      : songlist.filter(song => {
          return song.title.toLowerCase().includes(query.toLowerCase())
        })

  let sortedSongs = filteredSongs

  if (sortOptions) {
    const sortOption = sortOptions.find(option => option.current)
    sortedSongs = filteredSongs.sort((a, b) => {
      const titleA = a.title.toUpperCase()
      const titleB = b.title.toUpperCase()

      if (sortOption?.name === 'z-a') {
        if (titleA < titleB) return 1
        if (titleA > titleB) return -1
        return 0
      } else if (sortOption?.name === 'times played') {
        return b.timesPlayed - a.timesPlayed
      } else if (sortOption?.name === 'last time played') {
        const lastA = dayjs(a.lastTimePlayed)
        const lastB = dayjs(b.lastTimePlayed)
        if (lastA.isBefore(lastB)) return 1
        if (lastA.isAfter(lastB)) return -1
        return 0
      } else {
        if (titleA < titleB) return -1
        if (titleA > titleB) return 1
        return 0
      }
    })
  }

  const handleInputChange = event => {
    setQuery(event.target.value)
  }

  const handleClick = () => {
    setQuery('')
    setSelectedSong(null)
    typeof index === 'number'
      ? onPick(index, selectedSong)
      : onPick(selectedSong)
  }

  return (
    <div className='w-full md:w-[480px] flex flex-col'>
      <div className='flex space-x-4'>
        <Combobox
          as='div'
          className='w-full'
          value={selectedSong}
          onChange={setSelectedSong}
        >
          <div className='relative'>
            <Combobox.Input
              className='w-full py-2 pl-3 pr-10 focus:border-primary-dark focus:outline-none placeholder-disabled'
              onChange={handleInputChange}
              displayValue={song => song?.title}
              ref={songInput}
              placeholder={`type to search/filter${
                points ? ` - ${points} pt. pick` : ''
              }`}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
              <ChevronUpDownIcon
                className='h-5 w-5 text-primary-dark hover:text-primary-light'
                aria-hidden='true'
              />
            </Combobox.Button>

            {sortedSongs.length > 0 && (
              <Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm bg-black'>
                {sortedSongs.map(song => (
                  <Combobox.Option
                    key={song.id}
                    value={song}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'text-primary' : 'text-primary-dark',
                        prevShowSongIds 
                        ? prevShowSongIds[0]?.includes(song.id)
                          ? active
                            ? 'text-red-500'
                            : 'text-red-700'
                          : prevShowSongIds[1]?.includes(song.id)
                            ? active
                              ? 'text-blue-500'
                              : 'text-blue-700'
                            : prevShowSongIds[2]?.includes(song.id)
                              ? active
                                ? 'text-purple-500'
                                : 'text-purple-700'
                          : ''
                        : ''
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={classNames(
                            'block truncate',
                            selected && 'font-semibold'
                          )}
                        >
                          {song.title}
                        </span>
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </div>
        </Combobox>
        {onPick ? (
          <button
            type='button'
            className='text-primary-dark hover:text-primary-light'
            onClick={handleClick}
          >
            +
          </button>
        ) : null}
      </div>
    </div>
  )
}
