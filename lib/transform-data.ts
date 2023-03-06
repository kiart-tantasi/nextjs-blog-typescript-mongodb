import AWS from 'aws-sdk'
import { Db } from 'mongodb'

import { Article, ArticleCard } from '../interfaces/article'
import { EnvGetter } from './env-getter'

export const transformCardData = async (array: Article[], db: Db): Promise<ArticleCard[]> => {
    const result = []
    const secondArticleIdx = array.length - 2

    for (let idx = 0; idx < array.length; idx++) {
        const x = array[idx]
        let imgUrl = await transformImgUrl(x.img, db, idx >= secondArticleIdx)

        result.push({
            _id: x._id?.toString() || Math.random().toString(),
            title: x.title,
            desc: x.desc,
            img: imgUrl,
            alt: x.alt,
            date: x.date,
            category: x.category,
            slug: x.slug,
        })
    }
    return result
}

export const transformImgUrl = async (imgUrl: string, db: Db, accelerate: boolean) => {
    // IF NOT PRIVATE BUCKET, RETURN OLD URL
    if (!imgUrl.includes(EnvGetter.getPrivateBucketUrl())) return imgUrl

    const originalImgUrl = imgUrl
    const key: string = imgUrl.slice(60)
    const presignedUrlCollection = db.collection('presignedUrl')
    const result = await presignedUrlCollection.findOne({ key: key })
    const deadline = result ? result.age - 24 * 60 * 60 * 1000 : null // 1 day before expiration time
    const now = new Date().getTime()

    // 1 PRESIGNED URL EXISTS AND DOES NOT EXPIRE
    if (result && deadline && deadline > now) {
        imgUrl = result.url
    }

    // 2 PRESIGNED URL DOES NOT EXIST OR ALREADY EXPIRED
    else {
        // CREATE NEW PRESIGNED URL (AWS SDK)
        AWS.config.update({
            accessKeyId: EnvGetter.getAccessKeyId(),
            secretAccessKey: EnvGetter.getSecretAccessKey(),
            region: 'ap-southeast-1',
        })
        const s3 = new AWS.S3()
        let newPresignedUrl = s3.getSignedUrl('getObject', {
            Bucket: EnvGetter.getBucketName(),
            Key: key,
            Expires: 7 * 24 * 60 * 60,
        })
        const newPresignedUrlData = {
            key: key,
            url: newPresignedUrl,
            age: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
        }

        // 2.1 IF DOES NOT EXIST, INSERT
        if (!result) await presignedUrlCollection.insertOne(newPresignedUrlData)
        // 2.2 IF EXPIRED, REPLACE
        else if (deadline && deadline <= now) await presignedUrlCollection.replaceOne({ key: key }, newPresignedUrlData)

        imgUrl = newPresignedUrl
    }

    // Stop using Transfer Acceleration for now (3-6-2023)
    // // If Transfer Acceleration
    // if (accelerate === true && imgUrl !== originalImgUrl) {
    //     let tempParams = imgUrl.slice(60)
    //     imgUrl = 'https://privatepetchdotblog.s3-accelerate.amazonaws.com/' + tempParams
    // }
    return imgUrl
}
