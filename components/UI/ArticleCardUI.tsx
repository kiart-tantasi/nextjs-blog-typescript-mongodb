
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Link from "next/link";
import styles from "./ArticleCardUI.module.css"

const ArticleCardUI = (props:{title:string; desc:string; img:string; alt: string; date:number; views:number | undefined; markdown:string}) => {
    return (
        <article className={styles["article-author-container"]}>
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
                        <div className={styles["padding-bottom"]} dangerouslySetInnerHTML={{ __html: props.markdown }} />
                    </section>
                </Card>
                <div className={styles.author}>
                    <p>ผู้เขียน:</p><h3><Link href="/aboutme">Kiart Tantasi (เพชร)</Link></h3>
                    <br/><br/>
                    <p>GitHub:</p><a href="https://github.com/kiart-tantasi" target="_blank" rel="noopener noreferrer"><h3>kiart-tantasi</h3></a>
                </div>
        </article>
    )
}

export default ArticleCardUI;