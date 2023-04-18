import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import type { Venue } from '@prisma/client'

import { json } from '@remix-run/node'
import { useState } from 'react'
import { Form, useLoaderData } from '@remix-run/react'

import { VenueSelect } from '~/components/venue-select'
import { requireAdminUserSession } from '~/utils/session.server'
import { db } from '~/utils/db.server'

interface LoaderData {
  venues: Venue[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUserSession(request)

  const venues = await db.venue.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

  const data: LoaderData = {
    venues
  }

  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  await requireAdminUserSession(request)

  const form = await request.formData()
  const date = new Date(form.get('date'))
  const venueId = Number(form.get('venueId'))

  try {
    await db.show.create({
      data: {
        date,
        venueId,
        contest: {
          create: {}
        }
      }
    })
  } catch (e) {
    console.log({ e })
  }

  return null
}

const CreateShowRoute = () => {
  const { venues } = useLoaderData<LoaderData>()
  const [query, setQuery] = useState('')
  const [selectedVenue, setSelectedVenue] = useState<Venue>(null)

  return (
    <>
      <div className='text-center text-xl font-semibold pb-4'>create show</div>
      <Form reloadDocument method='post' autoComplete='off' className='w-full'>
        <div className='md:w-[420px] mx-auto flex flex-col items-center'>
          <label className='w-full flex items-center justify-between pb-2'>
            <div>date:</div>
            <input
              id='date'
              name='date'
              type='datetime-local'
              size={30}
              className='border border-primary-dark px-3 py-2'
              data-lpignore='true'
              required
            />
          </label>
          <label className='w-full flex items-center justify-between pb-2'>
            <div>venue:</div>
            <VenueSelect
              venues={venues}
              query={query}
              onQueryChange={setQuery}
              selectedVenue={selectedVenue}
              onSetSelectedVenue={setSelectedVenue}
            />
            <input type='hidden' name='venueId' value={selectedVenue?.id} />
          </label>
          <button type='submit' className='button'>
            create
          </button>
        </div>
      </Form>
    </>
  )
}

export default CreateShowRoute
