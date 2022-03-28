import ArticleUI from "./ArticleUI";
import AuthorUI from "./AuthorUI";
import styles from "./ArticleCardUI.module.css"

const ArticleCardUI = (props:{title:string; desc:string; img:string; alt: string; date:number; views:number | undefined; markdown:string}) => {
    return (
        <article className={styles["article-author-container"]}>
            <ArticleUI title={props.title} desc={props.desc} img={props.img} alt={props.alt} date={props.date} views={props.views} markdown={props.markdown} />
            <AuthorUI />
        </article>
    )
}

export default ArticleCardUI;