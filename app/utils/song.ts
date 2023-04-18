import { db } from '~/utils/db.server'
import { getPrevShowIds } from './show'

export const getSongs = async () => {
  return db.song.findMany({ orderBy: { title: 'asc' } })
}

export const getSong = async (id: Number): Song =>
  db.song.findUnique({ where: { id } })

export const getSongId = params => Number(params.songId)

export const getSongsPlayedShowBefore = async (showId: Number) => {
  const prevShowIds = await getPrevShowIds(showId)
  const indices = Object.keys(prevShowIds)

  let prevShowSongIds = {}

  for (let i = 0; i < indices.length; i++) {
    const sets = await db.set.findMany({
      where: {
        showId: prevShowIds[i]
      },
      include: {
        songs: {
          select: { songId: true }
        }
      }
    })
    
    prevShowSongIds[i] = sets?.map(set => set.songs.map(({ songId }) => songId )).flat() || []
  }

  return prevShowSongIds
}

export const searchSongs = async (query?: string) => {
  return db.song.findMany({
    where: {
      title: { contains: query ?? '' }
    },
    orderBy: {
      title: 'asc'
    }
  })
}
