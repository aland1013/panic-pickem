import { Link } from 'react-router-dom'

import { useOptionalUser } from '../utils/data'

const Header = () => {
  const user = useOptionalUser()

  return (
    <>
      <header className='container mx-auto h-[38px] flex items-center text-sm justify-between'>
        {user ? (
          <>
            <span>hi {user.username}</span>
            <div className='flex space-x-1'>
              {user.isAdmin ? (
                <Link to='/admin' className='link underline py-1 px-1'>
                  admin
                </Link>
              ) : null}
              <Link to='/shows' className='link underline py-1 px-1'>
                shows
              </Link>
              <Link to='/help' className='link underline py-1 px-1'>
                help
              </Link>
              {/* <Link to='/rules' className='link underline py-1 px-1'>rules</Link> */}
              <Link to='/logout' className='button'>
                logout
              </Link>
            </div>
          </>
        ) : null}
      </header>
      <div className='text-3xl text-center font-bold py-4 md:py-6'>
        panic pick'em <span className='text-xs text-disabled'>beta</span>
      </div>
    </>
  )
}
export default Header
