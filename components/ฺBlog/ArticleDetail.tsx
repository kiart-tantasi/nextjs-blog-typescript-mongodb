import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from "./ArticleDetail.module.css";


export default function ArticleDetail() {
    return (
    <div className={styles.card}>
        <Card sx={{ maxWidth: 1000, minHeight: 300 }}>
            <CardContent>
                <Typography gutterBottom variant="h4" component="div">หัวข้อบทความ</Typography>
                <Typography variant="body1" color="text.primary">คำอธิบายบทความ</Typography>
                <Typography variant="body1" color="text.secondary">นี้คือเนื้อหาของบทความตัวอย่างนี้คือเนื้อหาของบทความตัวอย่าง นี้คือเนื้อหาของบทความตัวอย่างนี้คือเนื้อหาของบทความตัวอย่าง นี้คือเนื้อหาของบทความตัวอย่างนี้คือเนื้อหาของบทความตัวอย่าง นี้คือเนื้อหาของบทความตัวอย่างนี้คือเนื้อหาของบทความตัวอย่าง </Typography>
            </CardContent>

        </Card>
    </div>
    )
}