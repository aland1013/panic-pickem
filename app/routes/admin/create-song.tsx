import type { ActionFunction } from '@remix-run/node'

import { Form, useActionData } from '@remix-run/react'

import { requireAdminUserSession } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const action: ActionFunction = async ({ request }) => {
  await requireAdminUserSession(request)

  const form = await request.formData()
  const title = form.get('title').trim()
  const original = Boolean(form.get('original'))

  try {
    await db.song.create({
      data: { title, original }
    })
    return true
  } catch (e) {
    console.log({ e })
  }
}

const CreateSongRoute = () => {
  const isSuccess = useActionData<Boolean>()
  return (
    <>
      <div className='text-center text-xl font-semibold pb-4'>create song</div>
      <Form reloadDocument method='post' autoComplete='off' className='w-full'>
        <div className='mx-auto flex flex-col items-center space-y-4'>
          <div className='flex flex-col justify-center space-y-4'>
            <label className='flex items-center space-x-2'>
              <div>title:</div>
              <input
                id='title'
                name='title'
                type='text'
                size={30}
                className='border border-primary-dark pl-2 py-1'
                data-lpignore='true'
                required
              />
            </label>
            <label className='flex items-center space-x-2'>
              <div>original:</div>
              <div className='flex items-center'>
                <input name='original' type='checkbox' />
                <div className='checkbox' />
              </div>
            </label>
          </div>
          <button type='submit' className='button'>
            create
          </button>
          {isSuccess ? (
            <div className='text-high'>successfully created song</div>
          ) : null}
        </div>
      </Form>
    </>
  )
}

export default CreateSongRoute
