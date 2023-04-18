import { db } from '~/utils/db.server'

export const checkForUser = async (filter: {
  username?: string
  email?: string
}) => {
  const user = await db.user.findFirst({
    where: filter
  })

  return Boolean(user)
}
