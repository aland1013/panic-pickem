import type { LoaderFunction } from '@remix-run/node'
import type { Show, Song } from '@prisma/client'

import { json } from '@remix-run/node'
import { useLoaderData, Outlet } from '@remix-run/react'

import { db } from '~/utils/db.server'
import { requireAdminUserSession } from '~/utils/session.server'
import { getSongs } from '~/utils/song'

interface LoaderData {
  shows: Show[]
  songs: Song[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUserSession(request)

  const shows = await db.show.findMany({
    include: {
      venue: true,
      setlist: true,
      contest: {
        include: {
          entries: true
        }
      }
    },
    orderBy: { date: 'asc' }
  })

  const songs = await getSongs()

  const data: LoaderData = { shows, songs }
  return json(data)
}

const EditShows = () => {
  const { shows, songs } = useLoaderData<LoaderData>()

  return <Outlet context={{ shows, songs }} />
}

export default EditShows
