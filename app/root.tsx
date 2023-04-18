import type {
  LinksFunction,
  MetaFunction,
  LoaderFunction
} from '@remix-run/node'

import { redirect, json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react'

import { getUser } from './utils/session.server'
import styles from './tailwind.css'
import Header from './components/header'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: "panic pick'em",
  viewport: 'width=device-width,initial-scale=1'
})

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  const route = new URL(request.url).pathname
  if (route === '/') {
    return redirect('/shows')
  }

  return json({ user })
}

const App = () => {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='true'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap'
          rel='stylesheet'
        />
        <Meta />
        <Links />
      </head>
      <body>
        <div className='min-h-screen px-1 md:px-4 lg:px-40 mx-auto pt-2 bg-black text-primary font-fira'>
          <Header />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>
      </body>
    </html>
  )
}

export default App
