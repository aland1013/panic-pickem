import type { LoaderFunction } from '@remix-run/node'
import type { User } from '@prisma/client'

import { json } from '@remix-run/node'
import { useLoaderData, Outlet } from '@remix-run/react'

import { db } from '~/utils/db.server'
import { requireAdminUserSession } from '~/utils/session.server'

interface LoaderData {
  users: User[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUserSession(request)

  const users = await db.user.findMany({})

  const data: LoaderData = { users }
  return json(data)
}

const EditUsers = () => {
  const { users } = useLoaderData<LoaderData>()

  return <Outlet context={{ users }} />
}

export default EditUsers
