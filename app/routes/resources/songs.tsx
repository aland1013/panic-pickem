import type { LoaderArgs } from '@remix-run/node'

import { json } from '@remix-run/node'
import { useState } from 'react'
import { useFetcher } from '@remix-run/react'
import { Combobox } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'

import { searchSongs } from '~/utils/song'
import { requireUserSession } from '~/utils/session.server'
import { classNames } from '~/utils/string'

export async function loader({ request }: LoaderArgs) {
  await requireUserSession(request)

  const url = new URL(request.url)
  const query = url.searchParams.get('query')

  return json({
    songs: await searchSongs(query)
  })
}

export function SongCombobox({ error }: { error?: string | null }) {
  const songFetcher = useFetcher<typeof loader>()
  const songs = songFetcher.data?.songs ?? []
  type Song = typeof songs[number]
  const [selectedSong, setSelectedSong] = useState<null | undefined | Song>(null)

  const handleInputChange = e => {
    songFetcher.submit(
      { query: e.target.value ?? '' },
      { method: 'get', action: '/resources/songs' }
    )
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
              placeholder='type to search/filter'
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
              <ChevronUpDownIcon
                className='h-5 w-5 text-primary-dark hover:text-primary-light'
                aria-hidden='true'
              />
            </Combobox.Button>

            {songs.length > 0 && (
              <Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm bg-black'>
                {songs.map(song => (
                  <Combobox.Option
                    key={song.id}
                    value={song}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'text-primary' : 'text-primary-dark'
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
      </div>
    </div>
  )
}