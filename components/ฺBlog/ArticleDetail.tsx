import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { Lexer, Parser } from 'marked';
import Card from '@mui/material/Card';
import { CardMedia } from '@mui/material';
import styles from "./ArticleDetail.module.css";
import { Article } from '../../models/article';

export default function ArticleDetail(props: Article) {
    const lexed = Lexer.lex(props.markdown);
    const parsed = Parser.parse(lexed);

    useEffect(() => {
        const incView = async() => {
            if (!props.slug || !props.category) return;
            const { slug, category } = props;
            await fetch("/api/inc-view", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({ slug, category })
            });
        }
        setTimeout(() => {
            incView();
        }, 2000);
    }, [props])

    return (
        <>
        <Head>
            <title>{props.title}</title>
            <meta name='description'content={props.desc} />
        </Head>
        <div className={styles["article-author-container"]}>
            <Card className={`${styles.article} ${styles["inside-container"]}`}>
                <h1 className={styles.title}>{props.title}</h1>
                <h2 className={styles.desc}>{props.desc}</h2>
                <CardMedia 
                sx={{maxHeight:"700px"}}
                component="img"
                image={props.img}
                alt={props.alt}
                />
                <p className={styles["date-views"]}>{new Date(props.date).toLocaleString("th-TH", {day:"numeric", month:"long", year:"numeric"})}</p>
                {props.views && <p className={styles["date-views"]}>เข้าชม {props.views} ครั้ง</p>}
                <hr />
                <article className={styles["padding-bottom"]} dangerouslySetInnerHTML={{ __html: parsed }} />
            </Card>
            <div className={styles.author}>
                <p>ผู้เขียน - เพชร</p><br/>
                <Link href="/aboutme">ประวัติผู้เขียน</Link>
            </div>
        </div>
        </>
    )
}