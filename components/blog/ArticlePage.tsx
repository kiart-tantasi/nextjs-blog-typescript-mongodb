import Head from 'next/head'
import { useContext, useEffect } from 'react'

import AuthContext from '../../context/auth-context'
import { Article } from '../../interfaces/article'
import ArticleCardUI from '../ui/ArticleCardUI'
import AdminNav from './AdminNav'
import { websiteNameEnglish } from '../../config'

export default function ArticlePage(props: Article) {
    const AuthCtx = useContext(AuthContext)
    const { isFetched, isAdmin } = AuthCtx

    useEffect(() => {
        if (!isFetched) return
        if (isAdmin) return
        const increaseView = async () => {
            if (!props.slug || !props.category) return
            const { slug, category } = props
            await fetch('/api/v1/inc-view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, category }),
            })
        }
        increaseView()
    }, [isFetched, isAdmin, props])

    return (
        <>
            <Head>
                <title>{props.title.trim() + ' | ' + websiteNameEnglish}</title>
                <meta name='description' content={props.desc} />
            </Head>
            {isAdmin && <AdminNav {...props} />}
            <ArticleCardUI
                title={props.title}
                desc={props.desc}
                img={props.img}
                alt={props.alt}
                date={props.date}
                views={props.views}
                markdown={props.markdown}
            />
        </>
    )
}
