import { Link } from '@remix-run/react'
import { useShow, useUser } from '~/utils/data'

const Leaderboard = () => {
  const { username } = useUser()
  const {
    contest: { entries }
  } = useShow()

  return entries?.length > 0 ? (
    <div>
      <table className='w-[210px] text-sm border border-primary-dark'>
        <tbody>
          <tr>
            <th
              colSpan={2}
              className='border-y border-primary-dark py-1 text-center'
            >
              top {entries.length}
            </th>
          </tr>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td
                className={
                  username === entry.user.username
                    ? 'text-high py-1 pl-4 border border-primary-dark'
                    : 'py-1 pl-4 border border-primary-dark'
                }
              >
                {
                  <Link to={`scorecards/${entry.user.id}`}>
                    {entry.user.username}
                  </Link>
                }
              </td>
              <td
                className={
                  username === entry.user.username
                    ? 'text-high w-10 border border-primary-dark text-center'
                    : 'w-10 border border-primary-dark text-center'
                }
              >
                {entry.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className='text-disabled'>no scores found</div>
  )
}
export default Leaderboard
