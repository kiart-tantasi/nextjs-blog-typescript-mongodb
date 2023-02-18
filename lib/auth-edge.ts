import { jwtVerify } from 'jose'

// ref: https://github.com/vercel/examples/blob/main/edge-middleware/jwt-authentication/lib/auth.ts
export async function verifyToken(token: string | undefined): Promise<boolean> {
    try {
        if (!token) {
            throw new Error('token not found')
        }
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtKey()))
        return !!verified.payload
    } catch (err) {
        return false
    }
}

// non-exported

const PRIVATE_KEY: string | undefined = process.env.PRIVATE_KEY

function getJwtKey(): string {
    return PRIVATE_KEY ?? ''
}
