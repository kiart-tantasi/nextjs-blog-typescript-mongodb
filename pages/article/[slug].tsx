import { Lexer, Parser } from 'marked'
import { MongoClient } from 'mongodb'
import { NextPage } from 'next'
import { GetStaticPaths, GetStaticProps } from 'next'

import ArticlePage from '../../components/blog/ArticlePage'
import { Article } from '../../interfaces/article'
import { EnvGetter } from '../../lib/env-getter'
import { transformImgUrl } from '../../lib/transform-data'
import Script from 'next/script'
import Head from 'next/head'

interface PageProps { article: Article | null }

const PublicArticle: NextPage<PageProps> = ({ article }: PageProps) => {
    if (article === null) {
        return <div>
            <h2>THe page exists but content is not available</h2>
            <h3>Sorry for Inconvenience</h3>
        </div>
    }
    return (
        <>
            <Script id="article-schema-markup" type='application/ld+json' dangerouslySetInnerHTML={{
                __html: `{
                        "@context": "https://schema.org",
                        "@type": "NewsArticle",
                        "headline": "${article.title}",
                        "image": [
                            "${article.img}"
                        ],
                        "datePublished": "${new Date(article.date).toISOString()}",
                        "author": [{
                            "@type": "Person",
                            "name": "${process.env.NEXT_PUBLIC_AUTHOR}",
                            "url": "${process.env.NEXT_PUBLIC_DOMAIN}/aboutme"
                        }]
                    }`
            }} />
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
        </>
    )
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
        // need fallback for case when adding new article. otherwise, website returns 404 on newly-added pages
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
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
