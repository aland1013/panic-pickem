import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import type { Set } from '@prisma/client'

import { json } from '@remix-run/node'
import { useLoaderData, Form } from '@remix-run/react'
import { useState } from 'react'

import { db } from '~/utils/db.server'
import { requireAdminUserSession } from '~/utils/session.server'

interface LoaderData {
  sets: Set[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUserSession(request)

  const sets = await db.set.findMany({})

  const data: LoaderData = { sets }
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  let setIds = form.get('setIds')
  if (!setIds) {
    return null
  }

  setIds = setIds.split(',')

  await db.set.deleteMany({
    where: {
      id: {
        in: setIds
      }
    }
  })

  return null
}

const EditSets = () => {
  const { sets } = useLoaderData()
  const [setIdsToDelete, setSetIdsToDelete] = useState([])

  const handleClick = (e, setId) => {
    if (e.target.checked) {
      setSetIdsToDelete(prev => prev.concat(setId))
    } else {
      setSetIdsToDelete(prev => prev.filter(id => id !== setId))
    }
  }

  return (
    <>
      <table className='mt-8 mb-4 w-full md:w-[420px] mx-auto text-sm border border-primary-dark'>
        <tbody>
          <tr>
            <th colSpan={4} className='border-y border-primary-dark'>
              sets
            </th>
          </tr>
          <tr>
            <th className='border border-primary-dark'>id</th>
            <th className='border border-primary-dark'>showId</th>
            <th className='border border-primary-dark'>number</th>
            <th className='border border-primary-dark'>delete</th>
          </tr>
          {sets.map(set => (
            <tr key={set.id}>
              <td className='border border-primary-dark px-2 text-center'>
                {set.id}
              </td>
              <td className='border border-primary-dark px-2 text-center'>
                {set.showId}
              </td>
              <td className='border border-primary-dark px-2 text-center'>
                {set.number}
              </td>
              <td className='border border-primary-dark px-2'>
                <label className='flex w-full justify-center'>
                  <input
                    name={set.id}
                    type='checkbox'
                    onClick={e => handleClick(e, set.id)}
                  />
                  <div className='checkbox' />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Form method='post' className='flex justify-center'>
        <input type='hidden' name='setIds' value={setIdsToDelete} />
        <button className='button' type='submit'>
          delete sets
        </button>
      </Form>
    </>
  )
}

export default EditSets
