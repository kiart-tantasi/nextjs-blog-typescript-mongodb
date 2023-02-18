import { Lexer, Parser } from 'marked'
import { MongoClient } from 'mongodb'
import { NextApiResponse, NextPage } from 'next'
import { GetServerSidePropsContext } from 'next'

import DeletedArticlePage from '../../../components/admin/DeleteArticlePage'
import NotFoundPage from '../../../components/blog/NotFoundPage'
import { Article } from '../../../interfaces/article'
import { removeTokenCookie } from '../../../lib/auth-cookie'
import { EnvGetter } from '../../../lib/env-getter'
import { isTokenValid } from '../../../lib/jwt-token-validation'
import { transformImgUrl } from '../../../lib/transform-data'

const DeletedArticle: NextPage<{ article: Article }> = (props: { article: Article }) => {
    const article = props.article
    if (article) return <DeletedArticlePage article={article} />
    return <NotFoundPage />
}

export default DeletedArticle

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

    // CONNECT DB AND COLLECTION
    const dbUrl = EnvGetter.getDbUrl()
    const client = new MongoClient(dbUrl)
    await client.connect()
    const db = client.db('blogDB')
    const collection = db.collection('bin')

    // FIND THE ARTICLE
    const slug = context.params!.slug
    const articleNoTransformed = await collection.findOne({ slug: slug })

    // IMMEDIATELY RETURN IF ARTICLE MATCHED TO SLUG IS NOT FOUND
    if (articleNoTransformed === null) return { props: {} }

    // TRANSFORM DATA
    const lexedMarkdown = Lexer.lex(articleNoTransformed.markdown)
    const parsedMarkdown = Parser.parse(lexedMarkdown)
    const transformedImgUrl = await transformImgUrl(articleNoTransformed.img, db, false)

    const transformedData: Article = {
        _id: articleNoTransformed!._id.toString(),
        title: articleNoTransformed.title,
        desc: articleNoTransformed.desc,
        markdown: parsedMarkdown,
        img: transformedImgUrl,
        alt: articleNoTransformed.alt,
        date: articleNoTransformed.date,
        category: articleNoTransformed.category,
        slug: articleNoTransformed.slug,
        views: articleNoTransformed.views ? articleNoTransformed.views : 1,
    }

    // CLOSE DB AND RETURN
    client.close()
    return {
        props: {
            article: transformedData,
        },
    }
}
