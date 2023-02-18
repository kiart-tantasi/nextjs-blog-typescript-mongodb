import jwt from 'jsonwebtoken'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { getTokenCookie } from './auth-cookie'
import { EnvGetter } from './env-getter'

export const isTokenValid = (token: string): boolean => {
    const privateKey = EnvGetter.getPrivateKey()
    let isValid = false
    jwt.verify(token, privateKey, function (err) {
        if (!err) {
            isValid = true
        }
    })
    return isValid
}

const isAuthenticated = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const token = getTokenCookie(req)

    if (!token) return res.status(400).json({ message: 'no token found' })
    const valid = isTokenValid(token)
    if (!valid) {
        res.status(401).json({ message: 'invalid token' })
    } else {
        await fn(req, res)
    }
}
export default isAuthenticated
