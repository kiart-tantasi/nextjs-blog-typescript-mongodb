export class EnvGetter {
    static getDbUrl = (): string => {
        return getEnv('DB_URL', process.env.DB_URL)
    }

    static getPrivateKey = (): string => {
        return getEnv('PRIVATE_KEY', process.env.PRIVATE_KEY)
    }

    static getAccessKeyId = (): string => {
        return getEnv('ACCESS_KEY_ID', process.env.ACCESS_KEY_ID)
    }

    static getSecretAccessKey = (): string => {
        return getEnv('SECRET_ACCESS_KEY', process.env.SECRET_ACCESS_KEY)
    }

    static getBucketName = (): string => {
        return getEnv('BUCKET_NAME', process.env.BUCKET_NAME)
    }

    static getPrivateBucketUrl = (): string => {
        return getEnv('PRIVATE_BUCKET_URL', process.env.PRIVATE_BUCKET_URL)
    }
}

function getEnv(envName: string, value: undefined | string): string {
    if (value === undefined || value.length === 0) {
        return `ENVIRONMENT VARIABLE "${envName}" IS NOT FOUND.`
    }
    return value
}
