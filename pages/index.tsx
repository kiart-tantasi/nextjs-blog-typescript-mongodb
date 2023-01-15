import { MongoClient } from 'mongodb'
import type { NextPage } from 'next'

import Articles from '../components/blog/Articles'
import { Article, ArticleCard } from '../interfaces/article'
import { EnvGetter } from '../lib/env-getter'
import { transformCardData } from '../lib/transform-data'

const Home: NextPage<{ articles: ArticleCard[] }> = props => {
    const articles = props.articles
    return <Articles articles={articles} />
}

export default Home

export async function getStaticProps() {
    const dbUrl = EnvGetter.getDbUrl()
    const client = new MongoClient(dbUrl)

    try {
        await client.connect()
        const db = client.db('blogDB')
        const collection = db.collection('main')
        const articles = (await collection.find({}).toArray()) as unknown as Article[]
        const transformedData: ArticleCard[] = await transformCardData(articles, db)

        client.close()
        return {
            props: {
                articles: transformedData,
            },
            revalidate: 10,
        }
    } catch (error) {
        client.close()
        return {
            props: {
                articles: [],
            },
            revalidate: 10,
        }
    }
}
