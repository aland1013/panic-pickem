export const classNames = (...classes: String[]) =>
  classes.filter(Boolean).join(' ')

export const validateUsername = (username: unknown) => {
  if (typeof username !== 'string' || username.length < 3) {
    return 'username must be 3 or more characters'
  }
}

export const validatePassword = (password: unknown) => {
  if (typeof password !== 'string' || password.length < 6) {
    return 'password must be 6 or more characters'
  }
}

export const validateUrl = (url: any) => {
  // TODO: match on routes like /shows/:showId
  let urls = ['/shows', '/admin']

  if (urls.includes(url)) {
    return url
  }

  return '/shows'
}
