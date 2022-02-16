import { Article } from "../../models/article";
import CardUI from "../UI/Card";

import styles from "./Articles.module.css";

const Articles = (props:{articles:Article[]}) => {
    return (
        <div className={`row ${styles.post} `}>
            {props.articles.map(x => {
                return (
                    <CardUI key={x.title + Math.random().toString()} title={x.title} desc={x.desc} markdown={x.markdown} date={x.date} />
                )
            })}
        </div>
    )
}

export default Articles;