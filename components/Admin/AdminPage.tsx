import Head from "next/head";
import Link from "next/link";
import Articles from "../ฺBlog/Articles";
import styles from "./AdminPage.module.css";
import { Button } from "@mui/material";
import { ArticleCard } from "../../models/article";

const AdminPage = (props:{handleLogOut:() => void; articles: ArticleCard[]}) => {

    return (
        <>
        <Head><title>WORKSPACE</title></Head>
        <div className={styles["nav-top"]}>
            <div className={styles["flex-container"]}>
                <div className={styles["flex-left"]}>
                    <Button><Link href="/workspace/new-article">เพิ่มบทความใหม่</Link></Button>
                </div>
                <div className={styles["flex-right"]}>
                    <Button onClick={props.handleLogOut}>ออกจากระบบ</Button>
                </div>
            </div>
        </div>
        <Articles articles={props.articles} />
        </>
    )
}

export default AdminPage;