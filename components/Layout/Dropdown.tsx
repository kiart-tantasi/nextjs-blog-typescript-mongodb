import Link from "next/link";
import MenuIcon from '@mui/icons-material/Menu';
import styles from "./Dropdown.module.css";


const Dropdown = () => {
    return (
        <div className={styles.dropdown}>
            <span className={styles["dropdown-button"]}><MenuIcon /></span>
            <div className={styles["dropdown-content"]}>
                <span className={styles["show-450"]}>
                    <Link href="/tech">โลกเทค</Link>
                </span>
                <span className={styles["show-860"]}>
                    <Link href="/HowIBuildThisWebsite">How I Build This Website</Link>
                </span>
                <Link href="/aboutme">ประวัติผู้เขียน</Link>
                <Link href="/others">บทความอื่น ๆ</Link>
            </div>
        </div>
    )
}

export default Dropdown;