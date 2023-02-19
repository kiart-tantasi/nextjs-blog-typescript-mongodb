import { jwtVerify } from 'jose'

// ref: https://github.com/vercel/examples/blob/main/edge-middleware/jwt-authentication/lib/auth.ts
export async function verifyToken(token: string | undefined): Promise<boolean> {
    if (!token) {
        return false
    }

    // if env PRIVATE_KEY is not set, error will be thrown
    const jwtKey = getJwtKey()

    // if error happens, it means that token expires or token is invalid
    return jwtVerify(token, new TextEncoder().encode(jwtKey)).then(() => true).catch(() => false)
}

// non-exported

const PRIVATE_KEY: string | undefined = process.env.PRIVATE_KEY

function getJwtKey(): string {
    if (!PRIVATE_KEY || !PRIVATE_KEY.length) {
        throw new Error('env PRIVATE_KEY is not set !')
    }
    return PRIVATE_KEY
}
