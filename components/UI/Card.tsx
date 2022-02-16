import { Article } from "../../models/article";
import Link from "next/link";
import styles from "./Card.module.css";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CardUI(props:Article) {
    return (
    <div className={styles.card}>
        <Card sx={{ maxWidth: 700 }}>

            <CardContent>
                <Typography gutterBottom variant="h5" component="div">{props.title}</Typography>
                <Typography variant="body2" color="text.secondary">{props.desc}</Typography>
            </CardContent>

            <CardActions>
                <Button size="small"><Link href="/articles"><p>อ่านเพิ่มเติม</p></Link></Button>
            </CardActions>

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