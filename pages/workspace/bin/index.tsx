import { MongoClient } from 'mongodb'
import type { GetServerSidePropsContext, NextApiResponse, NextPage } from 'next'

import BinPage from '../../../components/admin/BinPage'
import { ArticleCard } from '../../../interfaces/article'
import { Article } from '../../../interfaces/article'
import { removeTokenCookie } from '../../../lib/auth-cookie'
import { EnvGetter } from '../../../lib/env-getter'
import { isTokenValid } from '../../../lib/jwt-token-validation'
import { transformCardData } from '../../../lib/transform-data'

const ArticleBin: NextPage<{ articles: ArticleCard[] }> = (props: { articles: ArticleCard[] }) => {
    const articles = props.articles
    return <BinPage articles={articles} />
}

export default ArticleBin

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    // ------------------------------------- //
    // THIS IS TEMP MIDDLEWARE
    // TODO: use /middleware.ts instead
    const cookies = context.req.cookies
    const token = cookies['token']
    if (!token || !isTokenValid(token)) {
        removeTokenCookie(context.res as NextApiResponse)
        return {
            redirect: {
                destination: '/workspace'
            },
            props: {}
        }
    }
    // ------------------------------------- //

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
