import type { ActionFunction } from '@remix-run/node'

import { useSearchParams } from '@remix-run/react'

import { getUserId } from '~/utils/session.server'
import ShowInfo from '~/components/show-info'
import UserPicks from '~/components/user-picks'
import { checkForEntry, deleteEntry, createEntry } from '~/utils/entry'
import { useShow } from '~/utils/data'

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const userId = await getUserId(request)
  const contestId = Number(form.get('contestId'))
  let picks = form.get('picks')
  const existingPicks = form.get('existingPicks')

  if (picks === existingPicks) return true
  picks = picks.split(',').map(p => {
    const [songId, confidencePoints] = p.split('-')
    return {
      id: p,
      songId: Number(songId),
      confidencePoints: Number(confidencePoints)
    }
  })

  try {
    const entryId = `${userId}-${contestId}`
    const existingEntry = await checkForEntry(entryId)

    if (existingEntry) {
      await deleteEntry(entryId)
    }

    await createEntry({
      entryId,
      userId,
      contestId,
      picks
    })
  } catch (e) {
    console.log({ e })
  }

  return true
}

const ShowRoute = () => {
  const { date, psUrl } = useShow()

  const [searchParams] = useSearchParams()
  const infoType = searchParams.get('showInfo')

  const picksLocked = new Date(date).getTime() - new Date().getTime() < 0

  return picksLocked ? (
    <ShowInfo type={infoType} psUrl={psUrl} />
  ) : (
    <UserPicks />
  )
}

export default ShowRoute
