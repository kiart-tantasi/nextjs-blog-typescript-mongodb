import Head from 'next/head';
import { useContext, useEffect } from 'react';
import AuthContext from '../../context/auth-context';
import AdminNav from './AdminNav';
import ArticleCard from '../UI/ArticleCard';
import { Article } from '../../interfaces/article';

export default function ArticleDetail(props: Article) {
    const AuthCtx = useContext(AuthContext);
    const { isAdmin } = AuthCtx;

    useEffect(() => {
        if (isAdmin) return;
        const increaseView = async() => {
            if (!props.slug || !props.category) return;
            const { slug, category } = props;
            await fetch("/api/inc-view", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({ slug, category })
            });
        }
        setTimeout(() => {
            increaseView();
        }, 2000);
    }, [props, isAdmin]);

    return (
        <>
        <Head>
            <title>{props.title}</title>
            <meta name='description'content={props.desc} />
        </Head>
        {isAdmin && <AdminNav {...props} />}
        <ArticleCard title={props.title} desc={props.desc} img={props.img} alt={props.alt} date={props.date} views={props.views} markdown={props.markdown} />
        </>
    )
}