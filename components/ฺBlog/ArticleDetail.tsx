import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from "./ArticleDetail.module.css";

import { parsedByMarked } from '../../utilities/dummy-data';

export default function ArticleDetail() {
    return (
    <div className={`row ${styles.article}`}>
        <Card className={styles["inside-container"]} sx={{ maxWidth: "inherit"}}>
            <CardContent>
                <Typography gutterBottom variant="h4" component="div">หัวข้อบทความ</Typography>
                <Typography variant="body1" color="text.primary">คำอธิบายบทความ</Typography>
                <Typography variant="body1" color="text.secondary">
                    นี้คือเนื้อหาของบทความตัวอย่างนี้คือเนื้อหาของบทความตัวอย่าง 
                    นี้คือเนื้อหาของบทความตัวอย่างนี้คือเนื้อหาของบทความตัวอย่าง  
                    นี้คือเนื้อหาของบทความตัวอย่างนี้คือเนื้อหาของบทความตัวอย่าง  
                    นี้คือเนื้อหาของบทความตัวอย่างนี้คือเนื้อหาของบทความตัวอย่าง 
                </Typography>
            </CardContent>
        </Card>
        <div className={styles["inside-container"]}>
            <div dangerouslySetInnerHTML={{ __html: parsedByMarked }} />
        </div>
    </div>
    )
}