import { Article } from "../../models/article";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./CardUI.module.css";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardMedia from "@mui/material/CardMedia";

export default function CardUI(props:Article) {
    const linkHref = (props.category === "workspace") ? ("/workspace/" + props.slug): ("/" + props.slug);
    const router = useRouter();

    const pushLink = () => {
        router.push(linkHref);
    }

    return (
    <article onClick={pushLink} className={styles.card}>
        <Card sx={{borderRadius:{xs: 0, sm: 0.5, md: 1}}}>
            <CardMedia
            component="img"
            sx={{maxHeight:300}}
            image={props.img}
            alt={props.alt ? props.alt : props.title}
            />
            <h1 className={styles.title}>{props.title}</h1>
            <p className={styles.desc}>{props.desc}</p>
            <div className={styles["readmore-date"]}>
                <div className={styles["date-div"]}>
                    <Typography sx={{fontSize:11}} color="text.secondary">{new Date(props.date).toLocaleDateString("th-TH",{day:"numeric", month:"long", year:"numeric"})}</Typography>
                </div>
                <CardActions sx={{height:40}}>
                    <Button size="medium"><Link href={linkHref}><a className={styles["read-more-a-tag"]}><p>อ่านบทความ</p></a></Link></Button>
                </CardActions>
            </div>
        </Card>
    </article>
    )
}