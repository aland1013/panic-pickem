import type { LoaderFunction } from '@remix-run/node'
import type { Venue } from '@prisma/client'

import { json } from '@remix-run/node'
import { useLoaderData, Link, Form } from '@remix-run/react'
import { useState } from 'react'

import { db } from '~/utils/db.server'
import { requireAdminUserSession } from '~/utils/session.server'

interface LoaderData {
  venues: Venue[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUserSession(request)

  const venues = await db.venue.findMany()

  const data: LoaderData = { venues }
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  let venueIds = form.get('venueIds')

  if (!venueIds) {
    return null
  }

  venueIds = venueIds.split(',').map(id => Number(id))

  await db.venue.deleteMany({
    where: {
      id: {
        in: venueIds
      }
    }
  })

  return null
}

const EditVenues = () => {
  const { venues } = useLoaderData<LoaderData>()
  const [venueIdsToDelete, setVenueIdsToDelete] = useState([])

  const handleClick = (e, venueId) => {
    if (e.target.checked) {
      setVenueIdsToDelete(prev => prev.concat(venueId))
    } else {
      setVenueIdsToDelete(prev => prev.filter(id => id !== venueId))
    }
  }

  return (
    <>
      <table className='mt-8 mb-4 mx-auto text-sm border border-primary-dark'>
        <tbody>
          <tr>
            <th colSpan={5} className='border-y border-primary-dark'>
              venues
            </th>
          </tr>
          <tr>
            <th className='border border-primary-dark'>id</th>
            <th className='border border-primary-dark'>name</th>
            <th className='border border-primary-dark'>city</th>
            <th className='border border-primary-dark'>state</th>
            <th className='border border-primary-dark'>delete</th>
          </tr>
          {venues.map(venue => {
            const { name, city, state } = venue

            return (
              <tr key={venue.id}>
                <td className='border border-primary-dark px-2 text-center'>
                  <Link to={`${venue.id}`}>{venue.id}</Link>
                </td>
                <td className='border border-primary-dark px-2'>{name}</td>
                <td className='border border-primary-dark px-2'>{city}</td>
                <td className='border border-primary-dark px-2 text-center'>
                  {state}
                </td>
                <td className='border border-primary-dark px-2'>
                  <label className='flex w-full justify-center'>
                    <input
                      name={venue.id}
                      type='checkbox'
                      onClick={e => handleClick(e, venue.id)}
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
        <input type='hidden' name='venueIds' value={venueIdsToDelete} />
        <button className='button' type='submit'>
          delete venues
        </button>
      </Form>
    </>
  )
}

export default EditVenues
