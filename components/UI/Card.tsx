import { Article } from "../../models/article";

import styles from "./Card.module.css";

const CardUI = (props:Article) => {
    return (
        <div className={styles.card}>
        {   props.img && <img src={props.img} alt={props.alt ? props.alt : "img"}/>}
            <h3>{props.title}</h3>
            {props.date && <p>{new Date(props.date).toLocaleDateString()}</p>}
            <p>{props.desc}</p>
            <button>อ่านเพิ่มเติม</button>
        </div>
    )
}

export default CardUI;