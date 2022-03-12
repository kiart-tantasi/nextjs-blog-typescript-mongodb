import Head from "next/head";
import styles from "./BinPage.module.css";
import { ArticleCard } from "../../interfaces/article";
import CardUI from "../UI/CardUI";

const BinPage = (props:{articles: ArticleCard[]}) => {
    const reversedArticles = [...props.articles].reverse();

    return (
        <>
        <Head><title>BIN</title></Head>
        <h2 className={styles["top-text"]}>บทความที่ถูกลบ</h2>
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

                return <CardUI key={x._id} bin articleCard={articleCardData} />;
            })}
        </div>
        </>
    )
}

export default BinPage;