import type { LoaderFunction } from '@remix-run/node'
import type { Show } from '~/utils/interface'

import dayjs from 'dayjs'
import { json } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'

import { requireUserSession } from '~/utils/session.server'
import { getShows } from '../utils/show'
import { classNames } from '../utils/string'

interface LoaderData {
  shows: Show[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request)

  const shows = await getShows()

  const data: LoaderData = {
    shows
  }

  return json(data)
}

const Shows = () => {
  const { shows } = useLoaderData<LoaderData>()

  return (
    <div className='flex flex-col items-center text-center'>
      {shows.map((show: Show) => {
        const { date, venue, isOver } = show
        
        // only show current run and future shows
        // todo: make this better
        if (dayjs(date).isBefore(dayjs('2023-12-28'))) return null

        const formattedDate = dayjs(date).format('YYYY-MM-DD')
        const { name, city, state } = venue

        return (
          <Link
            key={show.id}
            className={classNames('link', isOver && 'text-primary-dark')}
            to={String(show.id)}
          >
            {formattedDate} {name}, {city}, {state}{' '}
          </Link>
        )
      })}
    </div>
  )
}

export default Shows
