import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import AuthContext from "../../context/auth-context";
import Dropdown from "./Dropdown";
import { AppBar } from '@mui/material';
import styles from "./MainNav.module.css";

const MainNav = () => {
  const router = useRouter();
  const AuthCtx = useContext(AuthContext);
  const { fetched, isAdmin, logIn } = AuthCtx;

  useEffect(() => {
    const checkIfAdmin = async() => {
      const response = await fetch("/api/validate-token");
      if (response.ok) {
        const data = await response.json();
        const isLoggedIn = data.isLoggedIn;
        if (isLoggedIn === true) {
          logIn();
        }
      }
      fetched();
    }
    checkIfAdmin();
  }, [logIn, fetched]);

  return (
    <AppBar position="static" sx={{height: {xs: 50} , backgroundColor: isAdmin? "rgb(18, 60, 124)": "rgb(47, 102, 184)"}}>
        <div className={styles.nav}>

          <div className={styles["blog-brand"]}>

            <span className={styles.petchdotblog}>
              <Link href="/">
                  <a>
                    <h1>เพชรดอทบล็อก</h1>
                  </a>
              </Link>
            </span>

            {isAdmin === true &&
            <span className={styles.workspace}>
              <Link href="/workspace">
                <a>
                  <h1>W<span className={styles["hide-workspace"]}>ORKSPACE</span></h1>
                </a>
              </Link>
            </span>}

          </div>
          
          <nav className={styles["main-nav"]}>
            <ul>
              <span className={styles["hide-450"]}>
                <li>
                  <Link href="/tech"><a className={router.pathname == "/tech" ? styles.active : ""}><p>เทค</p></a></Link>
                </li>
              </span>
              <span className={styles["hide-860"]}>
                <li>
                  <Link href="/HowIBuildThisWebsite"><a className={router.pathname == "/HowIBuildThisWebsite" ? styles.active : ""}><p>How I Build This Website</p></a></Link>
                </li>
              </span>
            </ul>
            <Dropdown />
          </nav>

        </div>
    </AppBar>
  )
}


export default MainNav;

