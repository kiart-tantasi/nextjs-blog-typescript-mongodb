import Head from 'next/head';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardMedia } from '@mui/material';
import styles from "./ArticleDetail.module.css";
import { Article } from '../../models/article';
import { Lexer, Parser } from 'marked';
import { useEffect } from 'react';

export default function ArticleDetail(props: Article) {
    const lexed = Lexer.lex(props.markdown);
    const parsed = Parser.parse(lexed);

    useEffect(() => {
        const incView = async() => {
            if (!props.slug) return;
            const slug = props.slug;
            await fetch("/api/inc-view", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({ slug })
            });
        }
        setTimeout(() => {
            incView();
        }, 2000);
    }, [props.slug])

    return (
        <>
        <Head>
            <title>{props.title}</title>
            <meta name='description'content={props.desc} />
        </Head>
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
        </>
    )
}