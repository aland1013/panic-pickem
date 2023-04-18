import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import type { Entry } from '@prisma/client'

import { json } from '@remix-run/node'
import { useLoaderData, Form, Link } from '@remix-run/react'
import { useState } from 'react'

import { db } from '~/utils/db.server'
import { requireAdminUserSession } from '~/utils/session.server'

interface LoaderData {
  entries: Entry[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUserSession(request)

  const entries = await db.entry.findMany({})

  const data: LoaderData = { entries }
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  let entryIds = form.get('entryIds')
  if (!entryIds) {
    return null
  }
  entryIds = entryIds.split(',')

  await db.entry.deleteMany({
    where: {
      id: {
        in: entryIds
      }
    }
  })

  return null
}

const EditEntries = () => {
  const { entries } = useLoaderData()
  const [entryIdsToDelete, setEntryIdsToDelete] = useState([])

  const handleClick = (e, entryId) => {
    if (e.target.checked) {
      setEntryIdsToDelete(prev => prev.concat(entryId))
    } else {
      setEntryIdsToDelete(prev => prev.filter(id => id !== entryId))
    }
  }

  return (
    <>
      <table className='mt-8 mb-4 w-full md:w-[420px] mx-auto text-sm border border-primary-dark'>
        <tbody>
          <tr>
            <th colSpan={5} className='border-y border-primary-dark'>
              entries
            </th>
          </tr>
          <tr>
            <th className='border border-primary-dark'>id</th>
            <th className='border border-primary-dark'>userId</th>
            <th className='border border-primary-dark'>contestId</th>
            <th className='border border-primary-dark'>score</th>
            <th className='border border-primary-dark'>delete</th>
          </tr>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td className='border border-primary-dark px-2 text-center'>
                <Link to={`${entry.id}`}>{entry.id}</Link>
              </td>
              <td className='border border-primary-dark px-2 text-center'>
                {entry.userId}
              </td>
              <td className='border border-primary-dark px-2 text-center'>
                {entry.contestId}
              </td>
              <td className='border border-primary-dark px-2 text-center'>
                {entry.score}
              </td>
              <td className='border border-primary-dark px-2'>
                <label className='flex w-full justify-center'>
                  <input
                    name={entry.id}
                    type='checkbox'
                    onClick={e => handleClick(e, entry.id)}
                  />
                  <div className='checkbox' />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Form method='post' className='flex justify-center'>
        <input type='hidden' name='entryIds' value={entryIdsToDelete} />
        <button className='button' type='submit'>
          delete entries
        </button>
      </Form>
    </>
  )
}

export default EditEntries
