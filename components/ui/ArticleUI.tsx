import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import styles from "./ArticleUI.module.css"

import domPurify from "dompurify";

const ArticleUI = (props:{title:string; desc:string; img:string; alt: string; date:number; views:number | undefined; markdown:string}) => {
    const [sanitizedMarkdown, setSanitizedMarkdown] = useState<string>("");

    useEffect(() => {
        const DomPurify = domPurify(window);
        const sanitizedHtml = DomPurify.sanitize(props.markdown);
        setSanitizedMarkdown(sanitizedHtml);
    }, [props.markdown]);

    return (
        <Card className={styles.article}>
            <section>
                <h1 className={styles.title}>{props.title}</h1>
                <CardMedia 
                sx={{maxHeight:"700px"}}
                component="img"
                image={props.img}
                alt={props.alt}
                />
                <p className={styles["date-views"]}>{new Date(props.date).toLocaleString("th-TH", {day:"numeric", month:"long", year:"numeric"})}</p>
                <hr />
                <div className={styles["padding-bottom"]} dangerouslySetInnerHTML={{ __html: sanitizedMarkdown || "" }} />
            </section>
        </Card>
    )
}

export default ArticleUI;
