import { Article } from "../../models/article";
import CardUI from "../UI/Card";

import styles from "./Articles.module.css";

const Articles = (props:{articles:Article[]}) => {
    return (
        <div className={`${styles.articles} `}>
            {props.articles.map(x => {
                return (
                    <CardUI key={x.title+x.date.toString()} title={x.title} desc={x.desc} markdown={x.markdown} date={x.date} img={x.img ? x.img: ""} alt={x.alt? x.alt: "img"} slug={x.slug} category={x.category} />
                )
            })}
        </div>
    )
}

export default Articles;