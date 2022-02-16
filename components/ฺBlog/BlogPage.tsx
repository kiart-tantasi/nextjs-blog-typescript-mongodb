import styles from "./BlogPage.module.css";
import Articles from "../Articles/Articles";

import { Article } from "../../models/article";

const BlogPage = (props: {articles: Article[]; heading?:string}) => {
    return (
        <div className={`${styles.layout} row`}>
            <h1 className={styles["top-text"]}>{props.heading}</h1>
            <Articles articles={props.articles} />
        </div>
    )
}

export default BlogPage;