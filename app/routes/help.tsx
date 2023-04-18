import type { LoaderFunction } from 'react-router'
import { requireUserSession } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request)

  return null
}

const HelpRoute = () => {
  return (
    <ul className='flex flex-col'>
      <li className='text-center underline hover:text-primary-light'>
        <a
          href='http://everydaycompanion.com/asp/default.asp'
          target='_blank'
          rel='noreferrer'  
        >
          Everyday Companion
        </a>
      </li>
      <li className='text-center underline hover:text-primary-light'>
        <a
          href='https://www.burnthday.com'
          target='_blank'
          rel='noreferrer'  
        >
          burnthday.com
        </a>
      </li>
    </ul>
  )
}

export default HelpRoute