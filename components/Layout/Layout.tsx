import MainNav from "./MainNav";
import Footer from "./Footer";
import styles from "./Layout.module.css";

const Layout:React.FC = (props) => {
    return (
        <div className={styles["flex-container"]}>
            <div className={styles["flex-nav"]}><MainNav /></div>
            <div className={styles["flex-body"]}>{props.children}</div>
            <div className={styles["flex-footer"]}><Footer /></div>
        </div>        
    )
}

export default Layout;