import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from "./ArticleDetail.module.css";

import { parsedByMarked } from '../../utilities/dummy-data';
import { CardMedia } from '@mui/material';

const dummyDate = 1645230287867;

export default function ArticleDetail() {
    return (
    <div className={`row ${styles.article}`}>
        <Card className={styles["inside-container"]} sx={{ maxWidth: "inherit"}}>
            <CardContent>
                <Typography gutterBottom variant="h4" component="div">หัวข้อบทความ</Typography>

                <CardMedia
                    component="img"
                    height="270"
                    image="https://i.ytimg.com/vi/L2ZxBtC9DjQ/maxresdefault.jpg"
                    alt="น้องหมาน้อย"
                />

                <Typography variant="body1" color="text.primary">คำอธิบายบทความ</Typography>
                <Typography variant="body1" color="text.secondary">{new Date(dummyDate).toLocaleDateString()}</Typography>
                <Typography variant="body1" color="text.primary">
                    <div className={styles["padding-bottom"]} dangerouslySetInnerHTML={{ __html: parsedByMarked }} />
                </Typography>
            </CardContent>
        </Card>
    </div>
    )
}