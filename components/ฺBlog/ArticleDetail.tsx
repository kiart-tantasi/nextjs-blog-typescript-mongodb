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
    <div className={`row ${styles.article}`}>
        <Head>
            <title>{props.title}</title>
            <meta name='description'content={props.desc} />
        </Head>
        <Card className={styles["inside-container"]} sx={{ maxWidth: "inherit"}}>
            <CardContent>
                <Typography gutterBottom variant="h4" component="div">{props.title}</Typography>

                <CardMedia
                    sx={{maxHeight:"800px", maxWidth: "700px"}}
                    component="img"
                    image={props.img}
                    alt={props.alt}
                />

                <Typography variant="body1" color="text.secondary">{new Date(props.date).toLocaleDateString()}</Typography>
                <hr />
                <div className={styles["padding-bottom"]} dangerouslySetInnerHTML={{ __html: parsed }} />
            </CardContent>
        </Card>
    </div>
    )
}