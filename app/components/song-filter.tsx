import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/20/solid'

import { classNames } from '~/utils/string'

const SongFilter = ({
  filters,
  onFilterChange,
  sortOptions,
  onSortChange,
  hidden = false
}) => {
  const filterOn = filters.find(f => f.checked)

  return (
    <Disclosure
      as='div'
      className={classNames(
        hidden ? 'invisible' : '',
        'w-full md:w-[480px] h-6 grid items-center text-sm text-primary-dark'
      )}
    >
      <div className='relative col-start-1 row-start-1 py-0'>
        <div className='flex space-x-0 px-0 pb-2'>
          <div className='flex items-center'>
            <FunnelIcon
              className={classNames(
                'mr-4 h-5 w-5 flex-none',
                filterOn ? 'text-primary' : null
              )}
            />
            {filters.map((option, i) => (
              <label
                key={option.value}
                className='pr-4 flex items-center cursor-pointer hover:text-primary-light'
              >
                <input
                  id={`type-${i}`}
                  name='type[]'
                  defaultValue={option.value}
                  defaultChecked={option.checked}
                  type='checkbox'
                  className='peer h-3 w-3 flex-shrink-0 mr-1 cursor-pointer'
                  onClick={() => onFilterChange(i)}
                />
                <div className='checkbox' />
                <div className='min-w-0 flex-1 peer-checked:text-primary'>
                  {option.label}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className='col-start-1 row-start-1 py-0'>
        <div className='mx-auto flex justify-end px-0 pb-2'>
          <Menu as='div' className='relative inline-block'>
            <div className='flex'>
              <Menu.Button className='group inline-flex justify-center hover:text-primary-light'>
                sort
                <ChevronDownIcon
                  className='-mr-1 ml-1 h-5 w-5 flex-shrink-0 group-hover:text-primary-light'
                  aria-hidden='true'
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right bg-black focus:outline-none'>
                <div className='py-1'>
                  {sortOptions.map((option, i) => (
                    <Menu.Item key={option.name}>
                      {({ active }) => (
                        <button
                          onClick={e => {
                            e.preventDefault()
                            onSortChange(i)
                          }}
                          className={classNames(
                            option.current
                              ? 'font-medium text-primary-light'
                              : null,
                            active ? null : 'text-primary-dark',
                            'block px-4 py-2'
                          )}
                        >
                          {option.name}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </Disclosure>
  )
}

export default SongFilter
