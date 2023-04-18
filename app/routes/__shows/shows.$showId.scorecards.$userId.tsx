import type { LoaderFunction } from '@remix-run/node'
import type { Entry } from '~/utils/interface'

import { Link, useParams, useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'

import Scorecard from '~/components/scorecard'
import { requireUserSession } from '~/utils/session.server'
import { getEntry, getRank } from '~/utils/entry'
import { getShowId, getShow } from '~/utils/show'

interface LoaderData {
  entry: Entry
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await requireUserSession(request)
  const { userId } = params
  const showId = await getShowId(params)
  const {
    contest: { id: contestId }
  } = await getShow(showId)
  const entry = await getEntry(userId, contestId)
  const rank = await getRank(contestId, entry.score)

  const data: LoaderData = {
    entry,
    rank
  }

  return json(data)
}

const ScorecardRoute = () => {
  const { showId } = useParams()
  const { entry, rank } = useLoaderData()

  return (
    <div className='flex flex-col items-center space-y-4'>
      <Scorecard entry={entry} rank={rank} />
      <Link to={`/shows/${showId}?showInfo=scores`} className='button'>
        scores
      </Link>
    </div>
  )
}

export default ScorecardRoute
