import CardUI from "../ui/CardUI";
import styles from "./Articles.module.css";
import { ArticleCard } from "../../interfaces/article";

const Articles = (props: {articles: ArticleCard[]; heading?:string}) => {
    const reversedArticles = [...props.articles].reverse();
    
    return (
        <>
        {props.heading && <h2 className={styles["top-text"]}>{props.heading}</h2>}
        {!props.heading && <div style={{height: "30px"}}></div>}
        <div className={`${styles.articles} `}>
            {reversedArticles.map((x, index) => {
                const articleCardData = {
                    index: index,
                    _id: x._id,
                    title: x.title,
                    desc: x.desc,
                    date: x.date,
                    img: x.img,
                    alt: x.alt,
                    slug: x.slug,
                    category: x.category
                }
                return (
                    <CardUI key={x._id} articleCard={articleCardData} />
                )
            })}
        </div>
        </>
    )
}

export default Articles;