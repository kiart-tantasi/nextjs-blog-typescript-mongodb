import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import styles from "./ArticleUI.module.css"

const ArticleUI = (props:{title:string; desc:string; img:string; alt: string; date:number; views:number | undefined; markdown:string}) => {
    const imgUrl = (props.img.includes("https://petchdotblog.s3.ap-southeast-1.amazonaws.com"))
    ? "https://petchdotblog.s3-accelerate.amazonaws.com" + props.img.slice(52)
    : props.img;

    return (
        <Card className={styles.article}>
            <section>
                <h1 className={styles.title}>{props.title}</h1>
                <CardMedia 
                sx={{maxHeight:"700px"}}
                component="img"
                image={imgUrl}
                alt={props.alt}
                />
                <p className={styles["date-views"]}>{new Date(props.date).toLocaleString("th-TH", {day:"numeric", month:"long", year:"numeric"})}</p>
                <hr />
                <div className={styles["padding-bottom"]} dangerouslySetInnerHTML={{ __html: props.markdown }} />
            </section>
        </Card>
    )
}

export default ArticleUI;