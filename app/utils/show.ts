import type { GetShowReturnType } from './interface'

import { db } from '~/utils/db.server'

export const getShows = async () => {
  return db.show.findMany({
    include: {
      venue: true,
      setlist: true,
      contest: true
    },
    orderBy: { date: 'asc' }
  })
}

export const getShow = async (id: string): GetShowReturnType =>
  db.show.findUnique({
    where: { id },
    include: {
      venue: true,
      contest: {
        include: {
          entries: {
            include: { user: true },
            orderBy: { score: 'desc' },
            take: 5
          }
        }
      },
      setlist: {
        include: {
          songs: { include: { song: true }, orderBy: { position: 'asc' } }
        }
      }
    }
  })

export const getShowId = params => Number(params.showId)

export const getPrevShowIds = async (showId: number) => {
  const showIds = (await db.show.findMany({ orderBy: { date: 'asc' }, select: { id: true } })).map(({ id }) => id)
  let showIndex = showIds.indexOf(showId) - 1
  
  const prevShowIds = {}
  let index = 0;
  
  while (showIndex >= 0 && index <= 3) {
    prevShowIds[index] = showIds[showIndex]
    showIndex--
    index++
  }

  return prevShowIds
}
