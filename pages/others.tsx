import { MongoClient } from 'mongodb'
import type { NextPage } from 'next'
import Head from 'next/head'

import Articles from '../components/blog/Articles'
import { ArticleCard } from '../interfaces/article'
import { Article } from '../interfaces/article'
import { EnvGetter } from '../lib/env-getter'
import { transformCardData } from '../lib/transform-data'
import { websiteNameEnglish } from '../utils/sharedData'

const Others: NextPage<{ articles: ArticleCard[] }> = (props: { articles: ArticleCard[] }) => {
    const { articles } = props
    return (
        <>
            <Head>
                <title>บทความนายเพชร | {websiteNameEnglish}</title>
            </Head>
            <Articles articles={articles} />
        </>
    )
}

export default Others

export async function getStaticProps() {
    const dbUrl = EnvGetter.getDbUrl()
    const client = new MongoClient(dbUrl)
    await client.connect()
    const db = client.db('blogDB')
    const collection = db.collection('others')
    const articles = (await collection.find({}).toArray()) as unknown as Article[]
    const transformedData: ArticleCard[] = await transformCardData(articles, db)

    // CLOSE DB AND RETURN
    client.close()
    return {
        props: {
            articles: transformedData,
        },
    }
}
