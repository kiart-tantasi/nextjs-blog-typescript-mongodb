import CardUI from "../UI/CardUI";
import styles from "./Articles.module.css";
import { Article } from "../../models/article";

const Articles = (props: {articles: Article[]; heading?:string}) => {
    const reversedArticles = [...props.articles].reverse();

    return (
        <div>
            <h2 className={styles["top-text"]}>{props.heading}</h2>
            <div className={`${styles.articles} `}>
                {reversedArticles.map(x => {
                    return (
                        <CardUI key={x.title+x.date.toString()} title={x.title} desc={x.desc} markdown={x.markdown} date={x.date} img={x.img ? x.img: ""} alt={x.alt? x.alt: "img"} slug={x.slug} category={x.category} />
                    )
                })}
            </div>
        </div>
    )
}

export default Articles;