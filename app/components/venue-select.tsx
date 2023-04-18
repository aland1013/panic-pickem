import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'

import { classNames } from '~/utils/string'

export const VenueSelect = ({
  venues,
  query,
  onQueryChange,
  selectedVenue,
  onSetSelectedVenue
}) => {
  const filteredVenues =
    query === ''
      ? venues
      : venues.filter(venue => {
          return venue.name.toLowerCase().includes(query.toLowerCase())
        })

  const handleInputChange = event => {
    onQueryChange(event.target.value)
  }

  return (
    <Combobox
      as='div'
      className='w-full'
      value={selectedVenue || null}
      onChange={onSetSelectedVenue}
    >
      <div className='relative'>
        <Combobox.Input
          className='w-full border border-primary-dark py-2 pl-3 pr-10 focus:border-primary-dark focus:outline-none'
          onChange={handleInputChange}
          displayValue={venue => venue?.name}
        />
        <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
          <ChevronUpDownIcon
            className='h-5 w-5 text-green'
            aria-hidden='true'
          />
        </Combobox.Button>

        {filteredVenues.length > 0 && (
          <Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto py-1 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm bg-black'>
            {filteredVenues.map(venue => (
              <Combobox.Option
                key={venue.id}
                value={venue}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'text-green' : 'text-primary-dark'
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
                      {venue.name}
                    </span>
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
