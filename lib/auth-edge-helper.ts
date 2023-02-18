
const PRIVATE_KEY: string | undefined = process.env.PRIVATE_KEY

export function getJwtSecretKey(): string {
    if (!PRIVATE_KEY || PRIVATE_KEY.length === 0) {
        throw new Error('The environment variable JWT_SECRET_KEY is not set.')
    }

    return PRIVATE_KEY
}
