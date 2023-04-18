import { Link } from '@remix-run/react'

const AdminRoute = () => (
  <div className='flex flex-col items-center'>
    <Link className='link' to='edit-users'>
      edit users
    </Link>
    <Link className='link' to='edit-shows'>
      edit shows
    </Link>
    <Link className='link' to='edit-songs'>
      edit songs
    </Link>
    <Link className='link' to='edit-entries'>
      edit entries
    </Link>
    <Link className='link' to='edit-contests'>
      edit contests
    </Link>
    <Link className='link' to='edit-sets'>
      edit sets
    </Link>
    <Link className='link' to='edit-venues'>
      edit venues
    </Link>
    <Link className='link' to='create-show'>
      create show
    </Link>
    <Link className='link' to='create-venue'>
      create venue
    </Link>
    <Link className='link' to='create-song'>
      create song
    </Link>
  </div>
)

export default AdminRoute
