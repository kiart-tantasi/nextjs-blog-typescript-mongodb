import Head from 'next/head';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardMedia } from '@mui/material';
import styles from "./ArticleDetail.module.css";
import { Article } from '../../models/article';
import { Lexer, Parser } from 'marked';

export default function ArticleDetail(props: Article) {
    const lexed = Lexer.lex(props.markdown);
    const parsed = Parser.parse(lexed);

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
            <Typography variant="body1" color="text.secondary">{new Date(props.date).toLocaleDateString("th")}</Typography>
            <hr />
            <article className={styles["padding-bottom"]} dangerouslySetInnerHTML={{ __html: parsed }} />
        </Card>
        </>
    )
}