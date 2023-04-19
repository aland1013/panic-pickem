import type { Entry } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'

import { json } from '@remix-run/node'
import { useLoaderData, Form } from '@remix-run/react'

import { db } from '~/utils/db.server'
import { requireAdminUserSession } from '~/utils/session.server'

interface LoaderData {
  entry: Entry
}

const getEntry = async entryId => 
  await db.entry.findUnique({
    where: { id: entryId },
    include: {
      picks: {
        include: {
          song: true
        }
      }
    }
  })

export const loader:LoaderFunction = async ({ params, request }) => {
  await requireAdminUserSession(request)
  const entry = await getEntry(params.entryId)

  const data: LoaderData = { entry }
  return json(data)
}

export const action: ActionFunction = async ({ params, request }) => {
  await requireAdminUserSession(request)
  const form = await request.formData()
  const action = form.get('_action')

  if (action === 'cancel') return null
  
  if (action === 'score' ) {
    const { entryId } = params
    const score = Number(form.get('score'))
    
    await db.entry.update({
      where: { id: entryId },
      data: { score }
     })    
  } else if (action.includes('update')) {
    const [, pickId] = action.split(' ')
    const isBustout = Boolean(form.get(pickId))
    
    await db.pick.update({
      where: { id: pickId },
      data: { isBustout }
    })
  }
  
  return null
}

const EditEntryRoute = () => {
  const { entry } = useLoaderData<LoaderData>()

  return (
    <>
      <div className='text-center text-xl font-semibold pb-4'>edit entry</div>
      <div className='flex flex-col items-center'>
        <Form reloadDocument method='post' autoComplete='off' className='w-full'>
          <table className='mx-auto text-sm border border-primary-dark mb-4'>
            <tbody>
              <tr>
                <th className='px-2 border-y border-primary-dark'>song</th>
                <th className='px-2 border-y border-primary-dark'>points</th>
                <th className='px-2 border-y border-primary-dark'>bustout</th>
                <th className='px-2 border-y border-primary-dark' />
              </tr>
              {entry.picks.map(pick => (
                <tr key={pick.id} className='border-b border-primary-dark'>
                  <td className='px-2'>{pick.song.title}</td>
                  <td className='px-2 text-center'>{pick.confidencePoints}</td>
                  <td className='px-2 text-center'>
                    <label className='flex w-full justify-center'>
                      <input
                        type='checkbox'
                        name={pick.id}
                        defaultChecked={pick.isBustout}
                      />
                      <div className='checkbox' />
                    </label>
                  </td>
                  <td>
                    <div className='px-2 py-1 flex items-center justify-center space-x-2'>
                      <button
                        type='submit'
                        name='_action'
                        value={`update ${pick.id}`}
                        className='button'
                      >
                        update
                      </button>
                      <button
                        type='submit'
                        name='_action'
                        value='cancel'
                        className='button'
                      >
                        x
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='flex items-center justify-center space-x-4'>
            <label className='flex items-center space-x-2'>
              <div>score:</div>
              <input
                name='score'
                type='number'
                defaultValue={entry.score}
                className='w-16 text-center border border-primary-dark py-1'
              />
            </label>
            <div className='flex space-x-4'>
              <button type='submit' name='_action' value='score' className='button'>
                update
              </button>
              <button type='submit' name='_action' value='cancel' className='button'>
                cancel
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}

export default EditEntryRoute
