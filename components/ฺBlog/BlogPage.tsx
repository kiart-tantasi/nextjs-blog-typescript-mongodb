import styles from "./BlogPage.module.css";
import Articles from "../ฺBlog/Articles";

import { Article } from "../../models/article";

const BlogPage = (props: {articles: Article[]; heading?:string}) => {
    return (
        <div className={`row`}>
            <h2 className={styles["top-text"]}>{props.heading}</h2>
            <Articles articles={props.articles} />
        </div>
    )
}

export default BlogPage;