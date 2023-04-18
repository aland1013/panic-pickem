import type { Request } from '@remix-run/node'

import { useActionData, Form, useSearchParams } from '@remix-run/react'
import { useState, useEffect } from 'react'
import { json } from '@remix-run/node'

import { login, register, createUserSession } from '~/utils/session.server'
import { validateUsername, validatePassword, validateUrl } from '~/utils/string'
import { checkForUser } from '~/utils/user'
import { classNames } from '~/utils/string'

const ADMIN_ONLY = false

type ActionData = {
  formError?: string
  fieldErrors: {
    username: string | undefined
    password: string | undefined
  }
  fields?: {
    loginType: string
    username: string
    email?: string
    password: string
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({
  request
}: {
  request: Request
}) => {
  const form = await request.formData()
  const loginType = form.get('loginType')
  const username = form.get('username').trim()
  const email = (form.get('email') || '').trim()
  const password = form.get('password').trim()
  const redirectTo = validateUrl(form.get('redirectTo') || '/shows')

  if (
    typeof loginType !== 'string' ||
    typeof username !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({
      formError: 'form not submitted correctly'
    })
  }

  const fields = { loginType, username, email, password }
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password)
  }

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields })

  switch (loginType) {
    case 'login': {
      const user = await login({ username, password })

      if (ADMIN_ONLY && !user.isAdmin) {
        return badRequest({
          fields,
          formError: 'logins are temporarily disabled'
        })
      }

      if (!user) {
        return badRequest({
          fields,
          formError: 'username/password incorrect'
        })
      }

      return createUserSession(user.id, user.isAdmin, redirectTo)
    }

    case 'register': {
      if (ADMIN_ONLY) {
        return badRequest({
          fields,
          formError: 'registrations are temporarily disabled'
        })
      }

      const userExists = await checkForUser({ username })

      if (userExists) {
        return badRequest({
          fields,
          formError: `username ${username} already exists`
        })
      }

      const user = await register({ username, email, password })
      if (!user) {
        return badRequest({
          fields,
          formError: 'something went wrong creating a new user'
        })
      }

      return createUserSession(user.id, user.isAdmin, redirectTo)
    }

    default: {
      return badRequest({
        fields,
        formError: 'login type invalid'
      })
    }
  }
}

const Login = () => {
  const [searchParams] = useSearchParams()
  const actionData = useActionData<ActionData>()

  const [loginType, setLoginType] = useState('login')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (actionData?.formError) {
      setError(actionData.formError)
    }

    if (actionData?.fieldErrors) {
      setError(actionData.fieldErrors)
    }
  }, [actionData])

  return (
    <Form
      onChange={() => setError(null)}
      method='POST'
      className='flex flex-col items-center justify-center'
    >
      <div className='w-[200px] mx-auto flex justify-center items-center text-lg mb-8'>
        <button
          className={classNames(
            'w-1/2 border-r border-primary-dark text-primary pr-2',
            loginType === 'login'
              ? 'text-primary'
              : 'text-primary-dark hover:text-primary-light'
          )}
          name='login'
          onClick={() => setLoginType('login')}
          disabled={loginType === 'login'}
        >
          sign in
        </button>
        <button
          className={classNames(
            'w-1/2 pl-2',
            loginType === 'register'
              ? 'text-primary'
              : 'text-primary-dark hover:text-primary-light'
          )}
          type='submit'
          name='loginType'
          value='register'
          onClick={() => setLoginType('register')}
          disabled={loginType === 'register'}
        >
          register
        </button>
      </div>

      <div>
        <input
          type='hidden'
          name='redirectTo'
          value={searchParams.get('redirectTo') ?? undefined}
        />
        <input type='hidden' name='loginType' defaultValue={loginType} />
        <div className='mb-2'>
          <div className='w-full flex flex-col items-center -space-y-px'>
            <label htmlFor='username-input' className='sr-only'>
              username
            </label>
            <input
              id='username-input'
              name='username'
              type='text'
              size={30}
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? 'username-error' : undefined
              }
              className='appearance-none border border-primary-dark px-3 py-2 placeholder-disabled focus:z-10 focus:border-primary focus:outline-none focus:ring-primary text-sm'
              placeholder='username'
              data-lpignore='true'
              required
              minLength={3}
              onChange={() => setError(null)}
            />

            {loginType === 'register' ? (
              <>
                <label htmlFor='email-input' className='sr-only'>
                  email address
                </label>
                <input
                  id='email-input'
                  name='email'
                  type='email'
                  size={30}
                  defaultValue={actionData?.fields?.email}
                  aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                  aria-errormessage={
                    actionData?.fieldErrors?.email ? 'email-error' : undefined
                  }
                  className='appearance-none border border-primary-dark px-3 py-2 placeholder-disabled focus:z-10 focus:border-primary focus:outline-none focus:ring-primary text-sm'
                  placeholder='email address'
                  data-lpignore='true'
                  required={loginType === 'register'}
                />
              </>
            ) : null}

            <label htmlFor='password-input' className='sr-only'>
              password
            </label>
            <input
              id='password-input'
              name='password'
              type='password'
              size={30}
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={
                actionData?.fieldErrors?.password ? 'password-error' : undefined
              }
              className='appearance-none border border-primary-dark px-3 py-2 placeholder-disabled focus:z-10 focus:border-primary focus:outline-none focus:ring-primary text-sm'
              placeholder='password'
              data-lpignore='true'
              required
              minLength={6}
            />
          </div>
        </div>
        <p
          className='h-6 text-high text-center mb-1'
          role='alert'
          id='form-error'
        >
          {error ? error.username || error.password || error : null}
        </p>

        <div className='flex flex-col justify-center'>
          {/* {loginType === 'login' ? (
              <div className='flex justify-center pb-4'>
                <button className='hover:text-green-light'>
                  forgot your password?
                </button>
              </div>
            ) : null} */}

          <button type='submit' className='button mx-auto'>
            {loginType === 'login' ? 'sign in' : 'register'}
          </button>
        </div>
      </div>
    </Form>
  )
}

export default Login
