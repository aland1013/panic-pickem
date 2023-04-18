// each time a song is added to a show's setlist
//  - update the score on all the entries

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const addSong = async (set, setSong) => {
  // add a song to a setlist
  const newOrExistingSet = await db.set.upsert({
    where: { id: set.id },
    update: {
      songs: {
        connectOrCreate:  {
          where: {
            id: setSong.id
          },
          create: {
            id: setSong.id,
            songId: setSong.songId,
            position: setSong.position
          }
        }
      }
    },
    create: {
      id: set.id,
      showId: set.showId,
      number: set.number,
      songs: {
        connectOrCreate:  {
          where: {
            id: setSong.id
          },
          create: {
            id: setSong.id,
            songId: setSong.songId,
            position: setSong.position
          }
        }
      }
    }
  })

  console.log({ newOrExistingSet })

  // update the score on each entry that had the song as one of its picks
  const { id: contestId } = await db.contest.findFirst({ where: { showId: set.showId } })
  console.log({ contestId })

  const { count } = await db.entry.updateMany({
    where: { 
      contestId,
      picks: {
        some: {
          songId: setSong.songId
        }
      }
    },
    data: {
      score: { increment: 1 }
    }
  })

  console.log({ count })
}

// { set, song }
await addSong({ id: '1-0', showId: 1, number: 0 }, { id: '152-0', songId: 152, position: 0})
await addSong({ id: '1-0', showId: 1, number: 0 }, { id: '142-1', songId: 142, position: 1 })
await addSong({ id: '1-0', showId: 1, number: 0 }, { id: '5-2', songId: 5, position: 2 })
await addSong({ id: '1-0', showId: 1, number: 0 }, { id: '2-3', songId: 2, position: 3 })
await addSong({ id: '1-0', showId: 1, number: 0 }, { id: '389-4', songId: 389, position: 4 })
await addSong({ id: '1-0', showId: 1, number: 0 }, { id: '292-5', songId: 292, position: 5 })
await addSong({ id: '1-0', showId: 1, number: 0 }, { id: '433-6', songId: 433, position: 6 })
await addSong({ id: '1-0', showId: 1, number: 0 }, { id: '336-7', songId: 336, position: 7 })
await addSong({ id: '1-0', showId: 1, number: 0 }, { id: '51-8', songId: 51, position: 8 })