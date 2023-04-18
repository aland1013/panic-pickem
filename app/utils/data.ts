import type { User, Show, Entry } from './interface'
import type { Song, Show as AdminShow } from '@prisma/client'

import { useMatches } from '@remix-run/react'
import { useMemo } from 'react'

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export const useMatchesData = (
  id: string
): Record<string, unknown> | undefined => {
  const matchingRoutes = useMatches()
  const route = useMemo(() => matchingRoutes.find(route => route.id === id), [
    matchingRoutes,
    id
  ])
  return route?.data
}

const isUser = (user: unknown): user is User => {
  return (
    !!user &&
    typeof (user as User).id === 'number' &&
    typeof (user as User).username === 'string' &&
    typeof (user as User).isAdmin === 'boolean'
  )
}

export const useOptionalUser = (): User | undefined => {
  const data = useMatchesData('root')
  if (!data || !isUser(data.user)) {
    return undefined
  }
  return data.user
}

export const useUser = (): User => {
  const maybeUser = useOptionalUser()
  if (!maybeUser) {
    throw new Error(
      'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.'
    )
  }
  return maybeUser
}

export const useAdminShows = (): AdminShow[] | undefined => {
  const data = useMatchesData('routes/admin/edit-shows')
  return data?.shows || undefined
}

export const useShow = (): Show | undefined => {
  const data = useMatchesData('routes/__shows')
  return data?.show || undefined
}

export const usePrevShowSongIds = (): number[] | undefined => {
  const data  = useMatchesData('routes/__shows')
  return data?.prevShowSongIds || undefined
}

export const useEntry = (): Entry | undefined => {
  const data = useMatchesData('routes/__shows')
  return data?.entry || undefined
}

export const useRank = (): number | undefined => {
  const data = useMatchesData('routes/__shows')
  return data?.rank || undefined
}

export const useSongs = (): Song[] | undefined => {
  const data = useMatchesData('routes/__shows')
  return data?.songs || undefined
}
