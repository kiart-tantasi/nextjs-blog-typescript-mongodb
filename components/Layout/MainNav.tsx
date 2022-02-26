import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppBar } from '@mui/material';
import styles from "./MainNav.module.css";

const MainNav = () => {
  const router = useRouter();
  const [ isAdmin, setIsAdmin ] = useState(false);

  useEffect(() => {
    const checkIfAdmin = async() => {
        const response = await fetch("/api/validate-token");
        if (response.ok) {
            setIsAdmin(true);
        }
    }
    checkIfAdmin();
  }, []);

  return (
    <AppBar position="static" sx={{height: {xs: 45, sm:50} , backgroundColor:"rgb(47, 102, 184)"}}>
        <div className={`${styles.nav}`}>
          <span className={styles["blog-brand"]}>
            <Link href="/">
              <a>
                <h1>
                  <span className={styles["remove-brand"]}>เ</span>พ<span className={styles["remove-brand"]}>ชร BLOG</span>
                </h1>
              </a>
            </Link>
            {isAdmin && 
            <Link href="/workspace">
              <a>
                <h1>
                  W<span className={styles["remove-brand"]}>ORKSPACE</span>
                </h1>
              </a>
            </Link>}
          </span>
          <div className={styles["nav-right"]}>
            <Link href="/tech"><a className={router.pathname == "/tech" ? styles.active : ""}><p>เทค</p></a></Link>
            <Link href="/gaming"><a className={router.pathname == "/gaming" ? styles.active : ""}><p>เกมมิ่ง</p></a></Link>
            <Link href="/workoutandhealth"><a className={router.pathname == "/workoutandhealth" ? styles.active : ""}><p>ออกกำลังกายและสุขภาพ</p></a></Link>
            <span className={styles.others}><Link href="/others"><a className={router.pathname == "/others" ? styles.active : ""}><p>อื่น ๆ </p></a></Link></span>
          </div>

        </div>
    </AppBar>
  )
}


export default MainNav;

