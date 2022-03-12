import Link from "next/link";
import Image from "next/image";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from "./CardUI.module.css";
import { ArticleCard } from "../../interfaces/article";

export default function CardUI(props:ArticleCard) {
    const href = (props.category === "workspace") ? ("/workspace/" + props.slug): ("/article/" + props.slug);
    const imgShouldBePrioritized = props.index === 0 || props.index === 1;

    return (
    <article className={styles.card}>
        <Card sx={{borderRadius:{xs: 0, sm: 0.5, md: 1}}}>
            {/* IMG */}
            <Link href={href}>
                <a>
                    <Image
                        priority={imgShouldBePrioritized}
                        unoptimized
                        src={props.img}
                        alt={props.alt}
                        width="550px"
                        height="300px"
                        placeholder="blur"
                        blurDataURL="/images/blur-image.png"
                    />
                </a>
            </Link>

            {/* TITLE */}
            <Link href={href}><a className={styles["title-a-tag"]}><h1 className={styles["title-h1-tag"]}>{props.title}</h1></a></Link>

            {/* DESC */}
            <p className={styles.desc}>{props.desc}</p>

            {/* DATE AND READMORE */}
            <div className={styles["date-readmore"]}>
                <div className={styles["date-div"]}>
                    <Typography sx={{fontSize:11}} color="text.secondary">{new Date(props.date).toLocaleDateString("th-TH",{day:"numeric", month:"long", year:"numeric"})}</Typography>
                </div>
                <CardActions sx={{height:40}}>
                    <Button size="large"><Link href={href}><a className={styles["read-more-a-tag"]}><p>อ่านบทความ</p></a></Link></Button>
                </CardActions>
            </div>
        </Card>
    </article>
    )
}