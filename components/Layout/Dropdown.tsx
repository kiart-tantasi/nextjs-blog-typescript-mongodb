import Link from "next/link";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import styles from "./Dropdown.module.css";

const Dropdown = () => {
    const [openDropdown, setOpenDropdown] = useState(false);

    const handleToggleDropdown = () => {
        setOpenDropdown(prev => !prev);
    }

    const handleCloseDropdown = () => {
        setOpenDropdown(false);
    }

    return (
        <div className={styles.dropdown}>
            <span onClick={handleToggleDropdown} className={styles["dropdown-button"]}><MenuIcon /></span>
            {openDropdown && 
            <div className={styles["dropdown-content"]}>
                <span onClick={handleCloseDropdown} className={styles["show-450"]}>
                    <Link href="/tech">โลกเทค</Link>
                </span>
                <span onClick={handleCloseDropdown} className={styles["show-860"]}>
                    <Link href="/HowIBuildThisWebsite">How I Build This Website</Link>
                </span>
                <span onClick={handleCloseDropdown}>
                    <Link href="/aboutme">ประวัติผู้เขียน</Link>
                </span>
                <span onClick={handleCloseDropdown}>
                    <Link href="/others">บทความอื่น ๆ</Link>
                </span>
            </div>
            }
        </div>
    )
}

export default Dropdown;