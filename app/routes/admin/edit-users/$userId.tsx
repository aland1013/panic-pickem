import { LoaderFunction, ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, Form } from '@remix-run/react'
import { User } from '@prisma/client'

import { db } from '~/utils/db.server'
import { requireAdminUserSession } from '~/utils/session.server'

interface LoaderData {
  user: User
}

const getUserId = params => Number(params.userId)
const getUser = async userId =>
  await db.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, isAdmin: true }
  })

export const loader: LoaderFunction = async ({ params, request }) => {
  await requireAdminUserSession(request)
  const userId = await getUserId(params)
  const user = await getUser(userId)

  const data: LoaderData = { user }
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  await requireAdminUserSession(request)

  const form = await request.formData()
  const currentUserData = JSON.parse(form.get('currentUserData'))
  const username = form.get('username')
  const email = form.get('email')
  const isAdmin = Boolean(form.get('isAdmin'))

  const same =
    currentUserData.username === username &&
    currentUserData.email === email &&
    currentUserData.isAdmin === isAdmin
  if (!same) {
    try {
      const userId = Number(form.get('userId'))
      await db.user.update({
        where: { id: userId },
        data: { username, email, isAdmin }
      })
    } catch (e) {
      console.log({ e })
    }
  }

  return null
}

const EditUserRoute = () => {
  const { user } = useLoaderData<LoaderData>()
  const { username, email, isAdmin } = user

  return (
    <>
      <div className='text-center text-xl font-semibold pb-4'>edit user</div>
      <Form reloadDocument method='post' autoComplete='off'>
        <input type='hidden' name='userId' value={user.id} />
        <input
          type='hidden'
          name='currentUserData'
          value={JSON.stringify(user)}
        />
        <div className='w-[420px] mx-auto flex flex-col items-center'>
          <label className='w-full flex items-center justify-between pb-2'>
            <div>username:</div>
            <input
              id='username'
              name='username'
              type='text'
              size={30}
              defaultValue={username}
              className='border border-primary-dark px-3 py-2'
              data-lpignore='true'
              required
            />
          </label>
          <label className='w-full flex items-center justify-between pb-2'>
            <div>email:</div>
            <input
              id='email'
              name='email'
              type='email'
              size={30}
              defaultValue={email}
              className='border border-primary-dark px-3 py-2'
              data-lpignore='true'
              required
            />
          </label>
          <label className='w-full flex items-center pb-4'>
            <div className='pr-3'>is admin:</div>
            <div className='flex items-center'>
              <input
                id='isAdmin'
                name='isAdmin'
                type='checkbox'
                className='h-4 w-4 border border-primary-dark'
                defaultChecked={isAdmin}
              />
              <div className='checkbox' />
            </div>
          </label>
          <button type='submit' className='button'>
            update
          </button>
        </div>
      </Form>
    </>
  )
}

export default EditUserRoute
