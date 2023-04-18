import type { LoaderFunction } from '@remix-run/node'
import type { Songs } from '@prisma/client'
import type { GetEntryReturnType, GetShowReturnType } from '~/utils/interface'

import dayjs from 'dayjs'
import { json } from '@remix-run/node'
import { useLoaderData, Outlet } from '@remix-run/react'

import { requireUserId } from '~/utils/session.server'
import { getShowId, getShow } from '~/utils/show'
import { getEntry, getRank } from '~/utils/entry'
import { getSongs, getSongsPlayedShowBefore } from '~/utils/song'

export interface LoaderData {
  show: GetShowReturnType
  entry: GetEntryReturnType
  songs: Songs[]
  prevShowSongIds: {
    0?: number[],
    1?: number[],
    2?: number[],
    3?: number[]
  }
}

export const loader: LoaderFunction = async ({
  params,
  request
}: {
  params: { showId: string }
  request: Request
}) => {
  const userId = await requireUserId(request)
  const showId = await getShowId(params)
  const show = await getShow(showId)
  const prevShowSongIds = await getSongsPlayedShowBefore(showId)

  const contestId = show.contest.id as number
  const entry = await getEntry(userId, contestId)
  const rank = await getRank(contestId, entry?.score)

  const songs = await getSongs()

  const data: LoaderData = { show, entry, songs, rank, prevShowSongIds }
  return json(data)
}

const ShowLayout = () => {
  const { show } = useLoaderData<LoaderData>()
  const { venue, date } = show
  const { name, city, state } = venue

  const formattedDate = dayjs(date).format('MMMM D, YYYY')

  return (
    <>
      <div className='flex flex-col items-center'>
        <div className='text-center text-lg md:text-xl font-semibold'>
          {name}, {city}, {state}
        </div>
        <div className='md:text-lg pb-4'>{formattedDate}</div>
      </div>
      <div className='pb-8'>
        <Outlet />
      </div>
    </>
  )
}

export default ShowLayout

export const useShowData = () => {
  return useLoaderData<LoaderData>()
}
