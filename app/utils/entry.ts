import type { GetEntryReturnType } from './interface'

import { db } from '~/utils/db.server'

export const getEntry = async (
  userId: number | string,
  contestId: number | string
): GetEntryReturnType =>
  db.entry.findUnique({
    where: { id: `${userId}-${contestId}` },
    include: {
      picks: { include: { song: true }, orderBy: { confidencePoints: 'desc' } },
      user: { select: { username: true } }
    }
  })

export const getRank = async (contestId: number, score?: number): number =>
  score
    ? (
        await db.entry.findMany({
          where: { contestId, score: { gt: score } }
        })
      ).length + 1
    : undefined

export const checkForEntry = async (id: string) => {
  const entry = await db.entry.findUnique({
    where: { id }
  })

  return Boolean(entry)
}

export const deleteEntry = async (id: string) =>
  db.entry.delete({
    where: { id }
  })

export const createEntry = async ({
  entryId,
  userId,
  contestId,
  picks
}: {
  entryId: string
  userId: number
  contestId: number
  picks: { id: string; songId: number; confidencePoints: number }[]
}) =>
  db.entry.create({
    data: {
      id: entryId,
      user: { connect: { id: userId } },
      contest: { connect: { id: contestId } },
      picks: {
        connectOrCreate: picks.map(p => ({
          where: { id: p.id },
          create: {
            id: p.id,
            songId: p.songId,
            confidencePoints: p.confidencePoints
          }
        }))
      }
    }
  })
