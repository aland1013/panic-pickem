import type { Venue } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'

import { requireAdminUserSession } from '~/utils/session.server'
import { json } from '@remix-run/node'
import { useLoaderData, Form, Link, useActionData } from '@remix-run/react'

import { db } from '~/utils/db.server'

interface LoaderData {
  venue: Venue
}

const getVenueId = params => Number(params.venueId)
const getVenue = async venueId =>
  await db.venue.findUnique({ where: { id: venueId } })

export const loader: LoaderFunction = async ({ params, request }) => {
  await requireAdminUserSession(request)
  const venueId = await getVenueId(params)
  const venue = await getVenue(venueId)

  const data: LoaderData = { venue }
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  await requireAdminUserSession(request)
  const form = await request.formData()
  const venueId = Number(form.get('venueId'))
  const name = form.get('name')
  const city = form.get('city')
  const state = form.get('state')

  try {
    await db.venue.update({
      where: { id: venueId },
      data: {
        name,
        city,
        state
      }
    })

    return true
  } catch (e) {
    console.log({ e })
  }
}

const EditVenueRoute = () => {
  const { venue } = useLoaderData<LoaderData>()
  const { name, city, state } = venue
  const isSuccess = useActionData<Boolean>()

  return (
    <Form method='post'>
      <input type='hidden' name='venueId' value={venue.id} />
      <div className='container mx-auto flex flex-col items-center space-y-4'>
        <label className='flex items-center space-x-2'>
          <div>name:</div>
          <input
            name='name'
            size={40}
            defaultValue={name}
            className='border border-primary-dark pl-2 py-1'
          />
        </label>
        <div className='flex items-center space-x-4'>
          <label className='flex items-center space-x-2'>
            <div>city:</div>
            <input
              name='city'
              defaultValue={city}
              className='border border-primary-dark pl-2 py-1'
            />
          </label>
          <label className='flex items-center space-x-2'>
            <div>state:</div>
            <input
              name='state'
              defaultValue={state}
              className='border border-primary-dark pl-2 py-1'
            />
          </label>
        </div>
        <div className='flex space-x-4'>
          <button type='submit' className='button'>
            update
          </button>
          <Link to='/admin/edit-venues' className='button'>
            cancel
          </Link>
        </div>
        {isSuccess ? (
          <div className='text-high'>successfully updated venue</div>
        ) : null}
      </div>
    </Form>
  )
}

export default EditVenueRoute
