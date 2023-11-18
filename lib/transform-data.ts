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

export const transformImgUrl = async (imgUrl: string, _db: Db, _accelerate: boolean): Promise<string> => {
    // not using AWS S3's presigned url currently
    return imgUrl
}
