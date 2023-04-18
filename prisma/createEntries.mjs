import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const createEntries = async () => {
  try {
    // create 2 users
    const user1 = await db.user.upsert({
      where: { username: 'user1' },
      update: {
        username: 'user1',
        email: 'user1@gmail.com',
        passwordHash:
          '$2a$10$svRs0b4SXmJ0gJCSduaNvOJi/22r8lUVg6VCLrLk3IT/9JmtjfyiG'
      },
      create: {
        username: 'user1',
        email: 'user1@gmail.com',
        passwordHash:
          '$2a$10$svRs0b4SXmJ0gJCSduaNvOJi/22r8lUVg6VCLrLk3IT/9JmtjfyiG'
      }
    })
    const user2 = await db.user.upsert({
      where: { username: 'user2' },
      update: {
        username: 'user2',
        email: 'user2@gmail.com',
        passwordHash:
          '$2a$10$svRs0b4SXmJ0gJCSduaNvOJi/22r8lUVg6VCLrLk3IT/9JmtjfyiG'
      },
      create: {
        username: 'user2',
        email: 'user2@gmail.com',
        passwordHash:
          '$2a$10$svRs0b4SXmJ0gJCSduaNvOJi/22r8lUVg6VCLrLk3IT/9JmtjfyiG'
      }
    })

    console.log(`${user1.id}-1`, `${user2.id}-1`)

    // create an entry for each user for the 10/21/22 show
    const entry1 = await db.entry.create({
      data: {
        id: `${user1.id}-1`,
        userId: user1.id,
        contestId: 1,
        picks: {
          connectOrCreate: [
            {
              where: { id: '221-15' },
              create: {
                id: '221-15',
                songId: 221,
                position: 15
              }
            },
            {
              where: { id: '247-14' },
              create: {
                id: '247-14',
                songId: 247,
                position: 14
              }
            },
            {
              where: { id: '283-0' },
              create: {
                id: '283-0',
                songId: 283,
                position: 0
              }
            },
            {
              where: { id: '284-1' },
              create: {
                id: '284-1',
                songId: 284,
                position: 1
              }
            },
            {
              where: { id: '290-7' },
              create: {
                id: '290-7',
                songId: 290,
                position: 7
              }
            },
            {
              where: { id: '298-8' },
              create: {
                id: '298-8',
                songId: 298,
                position: 8
              }
            },
            {
              where: { id: '302-13' },
              create: {
                id: '302-13',
                songId: 302,
                position: 13
              }
            },
            {
              where: { id: '305-17' },
              create: {
                id: '305-17',
                songId: 305,
                position: 17
              }
            },
            {
              where: { id: '319-12' },
              create: {
                id: '319-12',
                songId: 319,
                position: 12
              }
            },
            {
              where: { id: '38-2' },
              create: {
                id: '38-2',
                songId: 38,
                position: 2
              }
            },
            {
              where: { id: '53-10' },
              create: {
                id: '53-10',
                songId: 53,
                position: 10
              }
            },
            {
              where: { id: '76-3' },
              create: {
                id: '76-3',
                songId: 76,
                position: 3
              }
            },
            {
              where: { id: '95-9' },
              create: {
                id: '95-9',
                songId: 95,
                position: 9
              }
            },
            {
              where: { id: '98-16' },
              create: {
                id: '98-16',
                songId: 98,
                position: 16
              }
            }
          ]
        }
      }
    })

    const entry2 = await db.entry.create({
      data: {
        id: `${user2.id}-1`,
        userId: user2.id,
        contestId: 1,
        picks: {
          connectOrCreate: [
            {
              where: { id: '101-4' },
              create: {
                id: '101-4',
                songId: 101,
                position: 4
              }
            },
            {
              where: { id: '124-19' },
              create: {
                id: '124-19',
                songId: 124,
                position: 19
              }
            },
            {
              where: { id: '134-3' },
              create: {
                id: '134-3',
                songId: 134,
                position: 3
              }
            },
            {
              where: { id: '165-5' },
              create: {
                id: '165-5',
                songId: 165,
                position: 5
              }
            },
            {
              where: { id: '181-2' },
              create: {
                id: '181-2',
                songId: 181,
                position: 2
              }
            },
            {
              where: { id: '188-10' },
              create: {
                id: '188-10',
                songId: 188,
                position: 10
              }
            },
            {
              where: { id: '198-9' },
              create: {
                id: '198-9',
                songId: 198,
                position: 9
              }
            },
            {
              where: { id: '21-18' },
              create: {
                id: '21-18',
                songId: 21,
                position: 18
              }
            },
            {
              where: { id: '247-8' },
              create: {
                id: '247-8',
                songId: 247,
                position: 8
              }
            },
            {
              where: { id: '285-0' },
              create: {
                id: '285-0',
                songId: 285,
                position: 0
              }
            },
            {
              where: { id: '288-17' },
              create: {
                id: '288-17',
                songId: 288,
                position: 17
              }
            },
            {
              where: { id: '300-6' },
              create: {
                id: '300-6',
                songId: 300,
                position: 6
              }
            },
            {
              where: { id: '315-15' },
              create: {
                id: '315-15',
                songId: 315,
                position: 15
              }
            },
            {
              where: { id: '41-12' },
              create: {
                id: '41-12',
                songId: 41,
                position: 12
              }
            }
          ]
        }
      }
    })

    console.log({ entry1, entry2 })

    //score each entry
    // get a list of all the songIds that were played
    const show = await db.show.findUnique({
      where: { id: 1 },
      include: { setlist: { include: { songs: { include: { song: { include: { setlistSongs: true } } } } } } }
    })

    const songIds = show.setlist.map(set => set.songs.map(song => song.songId )).flat()
    console.log({ songIds })

    // check for entries that have each songId
    // increment the score for each match
    for (let i = 0; i < songIds.length; i++) {
      await db.entry.updateMany({
        where: { 
          contestId: 1,
          picks: {
            some: {
              songId: songIds[i]
            }
          }
        },
        data: {
          score: { increment: 1 }
        }
      })
    }
  } catch (e) {
    console.log({ e })
  }
}

createEntries()
