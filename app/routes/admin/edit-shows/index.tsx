import type { ActionFunction } from '@remix-run/node'

import dayjs from 'dayjs'
import { useState } from 'react'
import { Form, Link } from '@remix-run/react'

import { useAdminShows } from '~/utils/data'
import { db } from '~/utils/db.server'

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  let showIds = form.get('showIds')
  if (!showIds) {
    return null
  }

  showIds = showIds.split(',').map(id => Number(id))

  await db.show.deleteMany({
    where: {
      id: {
        in: showIds
      }
    }
  })

  return null
}

const EditShowsRoute = () => {
  const shows = useAdminShows()
  const [showIdsToDelete, setShowIdsToDelete] = useState([])

  const handleClick = (e, showId) => {
    if (e.target.checked) {
      setShowIdsToDelete(prev => prev.concat(showId))
    } else {
      setShowIdsToDelete(prev => prev.filter(id => id !== showId))
    }
  }

  return (
    <>
      <table className='mt-8 mb-4 mx-auto text-sm border border-primary-dark'>
        <tbody>
          <tr>
            <th colSpan={5} className='border-y border-primary-dark'>
              shows
            </th>
          </tr>
          <tr>
            <th className='border border-primary-dark'>id</th>
            <th className='border border-primary-dark'>date</th>
            <th className='border border-primary-dark'>venue</th>
            <th className='border border-primary-dark'>contestId</th>
            <th className='border border-primary-dark'>delete</th>
          </tr>
          {shows.map(show => {
            const { date, venue, contest } = show
            const formattedDate = dayjs(date).format('YYYY-MM-DD')

            return (
              <tr key={show.id}>
                <td className='border border-primary-dark px-2 text-center'>
                  <Link to={`${show.id}`}>{show.id}</Link>
                </td>
                <td className='border border-primary-dark px-2'>
                  {formattedDate}
                </td>
                <td className='border border-primary-dark px-2'>
                  {venue.name}
                </td>
                <td className='border border-primary-dark px-2 text-center'>
                  {contest?.id}
                </td>
                <td className='border border-primary-dark px-2'>
                  <label className='flex w-full justify-center'>
                    <input
                      name={show.id}
                      type='checkbox'
                      onClick={e => handleClick(e, show.id)}
                    />
                    <div className='checkbox' />
                  </label>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Form method='post' className='flex justify-center'>
        <input type='hidden' name='showIds' value={showIdsToDelete} />
        <button className='button' type='submit'>
          delete shows
        </button>
      </Form>
    </>
  )
}

export default EditShowsRoute
