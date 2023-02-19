export class EnvGetter {
    static getDbUrl = (): string => {
        return getEnv('DB_URL')
    }

    static getPrivateKey = (): string => {
        return getEnv('PRIVATE_KEY')
    }

    static getAccessKeyId = (): string => {
        return getEnv('ACCESS_KEY_ID')
    }

    static getSecretAccessKey = (): string => {
        return getEnv('SECRET_ACCESS_KEY')
    }

    static getBucketName = (): string => {
        return getEnv('BUCKET_NAME')
    }

    static getPrivateBucketUrl = (): string => {
        return getEnv('PRIVATE_BUCKET_URL')
    }
}

// non-export

function getEnv(envName: string): string {
    // this is not to protect but to warn dev that this function cannot be used on client side
    if (typeof window !== 'undefined') {
        throw new Error('ENVS CANNOT BE FOUND IN CLIENT')
    }

    // calling this env map on client side will get undefined
    // because client cannot access process.env
    const envMap: { [key: string]: string | undefined } = {
        'DB_URL': process.env.DB_URL,
        'PRIVATE_KEY': process.env.PRIVATE_KEY,
        'ACCESS_KEY_ID': process.env.ACCESS_KEY_ID,
        'SECRET_ACCESS_KEY': process.env.SECRET_ACCESS_KEY,
        'BUCKET_NAME': process.env.BUCKET_NAME,
        'PRIVATE_BUCKET_URL': process.env.PRIVATE_BUCKET_URL,
    }

    const envValue = envMap[envName]
    if (!envValue || !envValue.length) {
        return `ENVIRONMENT VARIABLE "${envName}" IS NOT SET.`
    }
    return envValue
}
