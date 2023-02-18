import { MongoClient } from 'mongodb'
import type { NextPage } from 'next'

import Articles from '../components/blog/Articles'
import { Article, ArticleCard } from '../interfaces/article'
import { EnvGetter } from '../lib/env-getter'
import { transformCardData } from '../lib/transform-data'

interface PageProps {
    articles: ArticleCard[]
}

const Home: NextPage<{ articles: ArticleCard[] }> = (props: PageProps) => {
    const articles = props.articles
    return <Articles articles={articles} />
}

export default Home

export async function getStaticProps(): Promise<{ props: { articles: ArticleCard[] } }> {
    const dbUrl = EnvGetter.getDbUrl()
    const client = new MongoClient(dbUrl)

    let articles: ArticleCard[] = []
    try {
        await client.connect()
        const db = client.db('blogDB')
        const collection = db.collection('main')
        const articlesFromDB = await collection.find({}).toArray()
        articles = await transformCardData(articlesFromDB as unknown as Article[], db)
        client.close()
    } catch (error) {
        client.close()
    }
    return {
        props: {
            articles,
        },
    }
}
