import { ArticleCard } from "../../models/article";
import Link from "next/link";
import styles from "./CardUI.module.css";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardMedia from "@mui/material/CardMedia";

export default function CardUI(props:ArticleCard) {
    const href = (props.category === "workspace") ? ("/workspace/" + props.slug): ("/" + props.slug);

    return (
    <article className={styles.card}>
        <Card sx={{borderRadius:{xs: 0, sm: 0.5, md: 1}}}>
            {/* IMG */}
            <Link href={href}>
                <a>
                    <CardMedia
                    component="img"
                    sx={{maxHeight:300}}
                    image={props.img}
                    alt={props.alt ? props.alt : props.title}
                    />
                </a>
            </Link>

            {/* TITLE */}
            <Link href={href}><a><h1 className={styles.title}>{props.title}</h1></a></Link>

            {/* DESC */}
            <p className={styles.desc}>{props.desc}</p>

            {/* DATE AND READMORE */}
            <div className={styles["date-readmore"]}>
                <div className={styles["date-div"]}>
                    <Typography sx={{fontSize:11}} color="text.secondary">{new Date(props.date).toLocaleDateString("th-TH",{day:"numeric", month:"long", year:"numeric"})}</Typography>
                </div>
                <CardActions sx={{height:40}}>
                    <Button size="medium"><Link href={href}><a className={styles["read-more-a-tag"]}><p>อ่านบทความ</p></a></Link></Button>
                </CardActions>
            </div>
        </Card>
    </article>
    )
}