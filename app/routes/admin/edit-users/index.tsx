import { Link, useOutletContext } from '@remix-run/react'

const EditUsersRoute = () => {
  const { users } = useOutletContext()

  return (
    <div className='flex flex-col items-center'>
      <div>edit users</div>
      {users.map(user => {
        return (
          <Link key={user.id} className='link' to={`${user.id}`}>
            {user.username}
          </Link>
        )
      })}
    </div>
  )
}

export default EditUsersRoute
