import { MongoClient } from 'mongodb'
import type { NextPage } from 'next'
import { GetServerSidePropsContext, NextApiResponse } from 'next'

import AdminPage from '../../components/admin/AdminPage'
import LoginPage from '../../components/admin/LoginPage'
import { ArticleCard } from '../../interfaces/article'
import { Article } from '../../interfaces/article'
import { removeTokenCookie } from '../../lib/auth-cookie'
import { EnvGetter } from '../../lib/env-getter'
import { tokenValidation } from '../../lib/jwt-token-validation'
import { transformCardData } from '../../lib/transform-data'

const WorkSpace: NextPage<{ articles: ArticleCard[] }> = props => {
    const articles = props.articles
    if (!articles) return <LoginPage />
    return <AdminPage articles={articles} />
}

export default WorkSpace

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    // CHECK TOKEN - IF INVALID, RETURN NULL AND REMOVE TOKEN IN COOKIE
    const token = context.req.cookies.token
    let result = tokenValidation(token)
    if (result === false) {
        const response = context.res as NextApiResponse
        removeTokenCookie(response)
        return { props: {} }
    }

    // CONNECT DB AND WORKSPACE COLLECTION
    const dbUrl = EnvGetter.getDbUrl()
    const client = new MongoClient(dbUrl)
    await client.connect()
    const db = client.db('blogDB')
    const collection = db.collection('workspace')
    const articleNoTransformed = (await collection.find({}).toArray()) as unknown as Article[]
    const transformedData: ArticleCard[] = await transformCardData(articleNoTransformed, db)

    // CLOSE DB AND RETURN
    client.close()
    return {
        props: {
            articles: transformedData,
        },
    }
}
