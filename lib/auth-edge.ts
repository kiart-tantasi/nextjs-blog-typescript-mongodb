import { jwtVerify } from 'jose'

// ref: https://github.com/vercel/examples/blob/main/edge-middleware/jwt-authentication/lib/auth.ts
export async function verifyToken(token: string | undefined): Promise<boolean> {
    if (!token) {
        return false
    }

    // if env PRIVATE_KEY is not set, error will be thrown
    const jwtKey = getJwtKey()

    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(jwtKey))
        const iat = verified.payload.iat
        if (!!iat && (Date.now() > (iat * 1000))) {
            return true
        }
    } catch {
        // verifying failed
    }
    return false
}

// non-exported

const PRIVATE_KEY: string | undefined = process.env.PRIVATE_KEY

function getJwtKey(): string {
    if (!PRIVATE_KEY || !PRIVATE_KEY.length) {
        throw new Error('env PRIVATE_KEY is not set !')
    }
    return PRIVATE_KEY
}
