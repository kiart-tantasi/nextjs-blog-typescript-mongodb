import { Lexer, Parser } from 'marked'
import { MongoClient } from 'mongodb'
import { NextPage } from 'next'
import { GetStaticPaths, GetStaticProps } from 'next'

import ArticlePage from '../../components/blog/ArticlePage'
import NotFoundPage from '../../components/blog/NotFoundPage'
import { Article } from '../../interfaces/article'
import { EnvGetter } from '../../lib/env-getter'
import { transformImgUrl } from '../../lib/transform-data'

const PublicArticle: NextPage<{ article: Article }> = props => {
    const { article } = props
    if (article !== null) {
        return (
            <ArticlePage
                title={article.title}
                desc={article.desc}
                img={article.img}
                alt={article.alt}
                date={article.date}
                markdown={article.markdown}
                category={article.category}
                slug={article.slug}
                views={article.views}
            />
        )
    }
    return <NotFoundPage />
}

export default PublicArticle

export const getStaticPaths: GetStaticPaths = async () => {
    const dbUrl = EnvGetter.getDbUrl()
    const client = new MongoClient(dbUrl)
    await client.connect()
    const db = client.db('blogDB')
    const collection = db.collection('main')
    const articles = await collection.find({}).toArray()
    const paths = articles.map(x => {
        return { params: { slug: x.slug } }
    })
    client.close()

    return {
        paths: paths,
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async context => {
    const slug = context.params!.slug
    const dbUrl = EnvGetter.getDbUrl()
    const client = new MongoClient(dbUrl)
    await client.connect()
    const db = client.db('blogDB')
    const collection = db.collection('main')
    const articleNoTransformed = await collection.findOne({ slug: slug })
    if (articleNoTransformed === null) return { props: { article: null } }

    // TRANSFORM DATA
    const objectIdAsString = articleNoTransformed!._id.toString()
    const markdownNoTransformed = articleNoTransformed.markdown
    const lexed = Lexer.lex(markdownNoTransformed)
    const parsedMarkdown = Parser.parse(lexed)
    const transformedImgUrl = await transformImgUrl(articleNoTransformed.img, db, true)

    const transformedData: Article = {
        _id: objectIdAsString,
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
        revalidate: 10,
    }
}
