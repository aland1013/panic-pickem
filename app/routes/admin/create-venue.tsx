import type { ActionFunction } from '@remix-run/node'
import { Form } from '@remix-run/react'

import { requireAdminUserSession } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const action: ActionFunction = async ({ request }) => {
  await requireAdminUserSession(request)

  const form = await request.formData()
  const name = form.get('name').trim()
  const city = form.get('city').trim()
  const state = form.get('state').trim()

  try {
    await db.venue.create({
      data: { name, city, state }
    })
  } catch (e) {
    console.log({ e })
  }

  return null
}

const CreateVenueRoute = () => {
  return (
    <>
      <div className='text-center text-xl font-semibold pb-4'>create venue</div>
      <Form reloadDocument method='post' autoComplete='off' className='w-full'>
        <div className='md:w-[420px] mx-auto flex flex-col items-center'>
          <label className='w-full flex items-center justify-between pb-2'>
            <div>name:</div>
            <input
              id='name'
              name='name'
              type='text'
              size={30}
              className='border border-primary-dark px-3 py-2'
              data-lpignore='true'
              required
            />
          </label>
          <label className='w-full flex items-center justify-between pb-2'>
            <div>city:</div>
            <input
              id='city'
              name='city'
              type='text'
              size={30}
              className='border border-primary-dark px-3 py-2'
              data-lpignore='true'
              required
            />
          </label>
          <label className='w-full flex items-center space-x-1 md:space-x-10 pb-4'>
            <div>state:</div>
            <input
              id='state'
              name='state'
              type='text'
              size={5}
              className='border border-primary-dark px-3 py-2'
              data-lpignore='true'
              required
            />
          </label>
          <button type='submit' className='button'>
            create
          </button>
        </div>
      </Form>
    </>
  )
}

export default CreateVenueRoute
