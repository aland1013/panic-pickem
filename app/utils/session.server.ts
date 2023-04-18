import type { LoginForm } from '~/utils/interface'

import bcrypt from 'bcryptjs'
import { createCookieSessionStorage, redirect } from '@remix-run/node'

import { db } from './db.server'

export const login = async ({ username, password }: LoginForm) => {
  const user = await db.user.findFirst({ where: { username } })
  if (!user) return null

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isCorrectPassword) return null

  return { id: user.id, isAdmin: user.isAdmin, username }
}

export const register = async ({ username, email, password }: LoginForm) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await db.user.create({
    data: { username, email, passwordHash }
  })

  return { id: user.id, username }
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'FP_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
})

export const createUserSession = async (
  userId: string,
  isAdmin: boolean,
  redirectTo: string
) => {
  const session = await storage.getSession()
  session.set('userId', userId)
  session.set('isAdmin', isAdmin)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session)
    }
  })
}

const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get('Cookie'))
}

export const requireUserSession = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getUserSession(request)

  if (!session.has('userId')) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])

    throw redirect(`/login?${searchParams}`)
  }

  return session
}

export const requireAdminUserSession = async (request: Request) => {
  const session = await getUserSession(request)

  if (!session.has('isAdmin')) {
    throw redirect('shows')
  }

  return session
}

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')

  return !userId || typeof userId !== 'number' ? null : userId
}

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')

  if (!userId || typeof userId !== 'number') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }

  return userId
}

export const getUser = async (request: Request) => {
  const userId = await getUserId(request)

  if (typeof userId !== 'number') {
    return null
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, isAdmin: true }
    })

    return user
  } catch {
    throw logout(request)
  }
}

export const logout = async (request: Request) => {
  const session = await getUserSession(request)

  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session)
    }
  })
}
