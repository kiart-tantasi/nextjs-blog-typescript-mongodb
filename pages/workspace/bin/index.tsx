import { MongoClient } from 'mongodb'
import type { NextPage } from 'next'

import BinPage from '../../../components/admin/BinPage'
import { ArticleCard } from '../../../interfaces/article'
import { Article } from '../../../interfaces/article'
import { EnvGetter } from '../../../lib/env-getter'
import { transformCardData } from '../../../lib/transform-data'

const ArticleBin: NextPage<{ articles: ArticleCard[] }> = props => {
    const articles = props.articles
    return <BinPage articles={articles} />
}

export default ArticleBin

export const getServerSideProps = async () => {
    // CONNECT DB AND WORKSPACE COLLECTION
    const dbUrl = EnvGetter.getDbUrl()
    const client = new MongoClient(dbUrl)
    await client.connect()
    const db = client.db('blogDB')
    const collection = db.collection('bin')
    const articleNoTransformed = (await collection.find({}).toArray()) as unknown as Article[]
    const transformedData = await transformCardData(articleNoTransformed, db)

    // CLOSE DB AND RETURN
    client.close()
    return {
        props: {
            articles: transformedData,
        },
    }
}
