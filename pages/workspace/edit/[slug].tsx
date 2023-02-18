import { MongoClient } from 'mongodb'
import { NextApiResponse, NextPage } from 'next'
import { GetServerSidePropsContext } from 'next'

import NotFoundPage from '../../../components/blog/NotFoundPage'
import Form from '../../../components/form/Form'
import { Article } from '../../../interfaces/article'
import { removeTokenCookie } from '../../../lib/auth-cookie'
import { EnvGetter } from '../../../lib/env-getter'
import { isTokenValid } from '../../../lib/jwt-token-validation'

const Edit: NextPage<{ article: Article }> = (props: { article: Article }) => {
    const article = props.article
    if (article) return <Form article={article} editMode={true} />
    return <NotFoundPage />
}

export default Edit

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

    // CONNECT DB
    const dbUrl = EnvGetter.getDbUrl()
    const client = new MongoClient(dbUrl)
    await client.connect()
    const db = client.db('blogDB')

    // 1. CHECK IF THE ARTICLE IS IN MAIN OR NOT 2. IF NOT, CHECK AGAIN IF IT IS IN WORKSPACE 3. IF IT IS NOT IN MAIN OR WORKSPACE, RETURN NULL PROPS
    // I DO THIS THIS BECAUSE THIS HERE CANNOT GET CATEGORY DATA BUT CAN ONLY GET SLUG THAT IS TYPED IN URL example: 'edit/noCateryDefinedHere'.
    const collection = db.collection('main')
    const slug = context.params!.slug

    let articleNoTransformed = await collection.findOne({ slug: slug })
    if (articleNoTransformed === null) {
        const workspace = db.collection('workspace')
        articleNoTransformed = await workspace.findOne({ slug: slug })
        if (articleNoTransformed === null) {
            return { props: {} }
        }
    }

    //TRANSFORM DATA (IF FOUND)
    const objectIdAsString = articleNoTransformed!._id.toString()
    const transformedData: Article = {
        _id: objectIdAsString,
        title: articleNoTransformed.title,
        desc: articleNoTransformed.desc,
        markdown: articleNoTransformed.markdown,
        img: articleNoTransformed.img,
        alt: articleNoTransformed.alt,
        date: articleNoTransformed.date,
        category: articleNoTransformed.category,
        slug: articleNoTransformed.slug,
        views: articleNoTransformed.views ? articleNoTransformed.views : 1,
    }

    // CLOSE DB AND RETURN PROPS
    client.close()
    return {
        props: {
            article: transformedData,
        },
    }
}
