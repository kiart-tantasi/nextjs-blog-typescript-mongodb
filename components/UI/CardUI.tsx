import { Article } from "../../models/article";
import Link from "next/link";
import styles from "./CardUI.module.css";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardMedia from "@mui/material/CardMedia";

export default function CardUI(props:Article) {
    const cardWidth = 550;
    const newDesc = props.desc.length >= 60 ? props.desc.slice(0,60).trim() + "...": props.desc;

    return (
    <div className={styles.card} style={{width:cardWidth}}>
        <Card sx={{ maxWidth: cardWidth }}>

            {props.img &&
            <CardMedia
                component="img"
                height="270"
                image={props.img}
                alt={props.alt ? props.alt : props.title} 
            />}

            <CardContent sx={{height:80}}>  
                <Typography className={styles.title} variant="h5">{props.title}</Typography>
                <Typography variant="body2" color="text.secondary">{newDesc}</Typography>
            </CardContent>
            
            <div className={styles["readmore-date"]}>
                <CardActions sx={{height:40}}>
                    <Button size="medium"><Link href={"/" + props.slug}><a className={styles["read-more-a-tag"]}><p>อ่านบทความ</p></a></Link></Button>
                </CardActions>
                <div className={styles["date-div"]}>
                    <Typography sx={{fontSize:11}} color="text.secondary">{new Date(props.date).toLocaleDateString("th-TH",{day:"numeric", month:"long", year: "2-digit"})}</Typography>
                </div>
            </div>

        </Card>
    </div>
    )
}


const CardUITwo = (props:Article) => {
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