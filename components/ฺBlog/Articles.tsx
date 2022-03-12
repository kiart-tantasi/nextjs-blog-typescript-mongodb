import CardUI from "../UI/CardUI";
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
                // AWS S3 Transfer Acceleration for first 2 imgs
                const imgSrc = (x.img.includes("https://petchdotblog.s3.ap-southeast-1.amazonaws.com") && index <= 1) 
                ? "https://petchdotblog.s3-accelerate.amazonaws.com" + x.img.slice(52)
                : (x.img)
                const articleCardData = {
                    index: index,
                    _id: x._id,
                    title: x.title,
                    desc: x.desc,
                    date: x.date,
                    img: imgSrc,
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