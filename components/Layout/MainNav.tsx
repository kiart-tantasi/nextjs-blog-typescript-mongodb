import Link from "next/link";
import { useRouter } from "next/router";
import { AppBar } from '@mui/material';
import styles from "./MainNav.module.css";

const MainNav = () => {
  const router = useRouter();

  return (
    <AppBar className="theme-color" color="inherit" sx={{ height: 50}}>
        <div className={`row ${styles.nav}`}>

          <span className={styles["blog-brand"]}><Link href="/"><a><h1>เพชร THE BLOG</h1></a></Link></span>

          <div className={styles["nav-right"]}>
            <Link href="/tech"><a className={router.pathname == "/tech" ? styles.active : ""}><p>เทค</p></a></Link>
            <Link href="/gaming"><a className={router.pathname == "/gaming" ? styles.active : ""}><p>เกมมิ่ง</p></a></Link>
            <Link href="/english"><a className={router.pathname == "/english" ? styles.active : ""}><p>ภาษาอังกฤษ</p></a></Link>
            <Link href="/workoutandhealth"><a className={router.pathname == "/workoutandhealth" ? styles.active : ""}><p>ออกกำลังกายและสุขภาพ</p></a></Link>
            <Link href="/others"><a className={router.pathname == "/others" ? styles.active : ""}><p>อื่น ๆ </p></a></Link>
          </div>

        </div>
    </AppBar>
  )
}


export default MainNav;

