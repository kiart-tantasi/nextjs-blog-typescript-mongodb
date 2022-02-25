import { serialize, parse } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

// SOURCE: https://github.com/vercel/next.js/blob/31ab12aaf779ba2d429d6093cf94281df40e9771/examples/with-passport/lib/auth-cookies.js#L28

const MAX_AGE = 7200;

export function setTokenCookie(res: NextApiResponse, token: string) {
  const cookie = serialize("token", token, {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
  })
  res.setHeader('Set-Cookie', cookie)
}

export function removeTokenCookie(res: NextApiResponse) {
  const cookie = serialize("token", '', {
    maxAge: -1,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}

export function parseCookies(req: NextApiRequest) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie
  return parse(cookie || '')
}

export function getTokenCookie(req: NextApiRequest) {
  const cookies = parseCookies(req)
  return cookies.token;
}