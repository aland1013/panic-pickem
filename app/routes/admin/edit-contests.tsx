import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import type { Contest } from '@prisma/client'

import { json } from '@remix-run/node'
import { useLoaderData, Form } from '@remix-run/react'
import { useState } from 'react'

import { db } from '~/utils/db.server'
import { requireAdminUserSession } from '~/utils/session.server'

interface LoaderData {
  contests: Contest[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUserSession(request)

  const contests = await db.contest.findMany({})

  const data: LoaderData = { contests }
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  let contestIds = form.get('contestIds')
  if (!contestIds) {
    return null
  }

  contestIds = contestIds.split(',').map(id => Number(id))

  await db.contest.deleteMany({
    where: {
      id: {
        in: contestIds
      }
    }
  })

  return null
}

const EditContests = () => {
  const { contests } = useLoaderData()
  const [contestIdsToDelete, setContestIdsToDelete] = useState([])

  const handleClick = (e, contestId) => {
    if (e.target.checked) {
      setContestIdsToDelete(prev => prev.concat(contestId))
    } else {
      setContestIdsToDelete(prev => prev.filter(id => id !== contestId))
    }
  }

  return (
    <>
      <table className='mt-8 mb-4 w-full md:w-[420px] mx-auto text-sm border border-primary-dark'>
        <tbody>
          <tr>
            <th colSpan={3} className='border-y border-primary-dark'>
              contests
            </th>
          </tr>
          <tr>
            <th className='border border-primary-dark'>id</th>
            <th className='border border-primary-dark'>showId</th>
            <th className='border border-primary-dark'>delete</th>
          </tr>
          {contests.map(contest => (
            <tr key={contest.id}>
              <td className='border border-primary-dark px-2 text-center'>
                {contest.id}
              </td>
              <td className='border border-primary-dark px-2 text-center'>
                {contest.showId}
              </td>
              <td className='border border-primary-dark px-2'>
                <label className='flex w-full justify-center'>
                  <input
                    name={contest.id}
                    type='checkbox'
                    onClick={e => handleClick(e, contest.id)}
                  />
                  <div className='checkbox' />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Form method='post' className='flex justify-center'>
        <input type='hidden' name='contestIds' value={contestIdsToDelete} />
        <button className='button' type='submit'>
          delete contests
        </button>
      </Form>
    </>
  )
}

export default EditContests
