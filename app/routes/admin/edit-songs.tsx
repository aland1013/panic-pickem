import type { LoaderFunction } from '@remix-run/node'
import type { Song } from '@prisma/client'

import { json } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'

import { requireAdminUserSession } from '~/utils/session.server'
import { getSongs } from '~/utils/song'

interface LoaderData {
  songs: Song[]
}

export const loader: LoaderFunction = async ({
  params,
  request
}: {
  params: { songId: string; request: Request }
}) => {
  await requireAdminUserSession(request)

  const songs = await getSongs()

  const data: LoaderData = { songs }
  return json(data)
}

const EditSongs = () => {
  const { songs } = useLoaderData<LoaderData>()

  return (
    <>
      <div className='text-center font-bold pb-4'>edit songs</div>
      <div className='flex flex-col items-center text-center'>
        {songs.map((song: Song) => (
          <Link key={song.id} className='link' to={String(song.id)}>
            {song.title}
          </Link>
        ))}
      </div>
    </>
  )
}

export default EditSongs
