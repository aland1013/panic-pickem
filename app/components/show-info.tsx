import { useState } from 'react'

import Setlist from './setlist'
import Scores from './scores'
import { classNames } from '~/utils/string'

const ShowInfo = ({ type, psUrl }) => {
  const [infoType, setInfoType] = useState(type || 'setlist')

  return (
    <div className='w-full flex flex-col justify-center items-center text-lg space-y-4'>
      <div className='flex items-center'>
        <button
          className={classNames(
            'border-r border-primary-dark pr-2',
            infoType === 'setlist'
              ? 'text-primary'
              : 'text-primary-dark hover:text-primary-light'
          )}
          name='setlist'
          type='button'
          onClick={() => setInfoType('setlist')}
          disabled={infoType === 'setlist'}
        >
          setlist
        </button>
        <button
          className={classNames(
            infoType === 'scores'
              ? 'text-primary'
              : 'text-primary-dark hover:text-primary-light',
            psUrl ? 'border-r border-primary-dark px-2' : 'pl-2'
          )}
          name='scores'
          type='button'
          onClick={() => setInfoType('scores')}
          disabled={infoType === 'scores'}
        >
          scores
        </button>
        {psUrl ? (
          <a
            href={psUrl}
            target='_blank'
            rel='noreferrer'
            className={classNames(
              'pl-2 text-primary-dark hover:text-primary-light'
            )}
          >
            listen
          </a>
        ) : null}
      </div>
      {infoType === 'setlist' ? <Setlist /> : <Scores />}
    </div>
  )
}

export default ShowInfo
