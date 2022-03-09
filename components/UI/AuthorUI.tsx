import Link from "next/link";
import styles from "./AuthorUI.module.css"

const AuthorUI = () => {
    return (
        <div className={styles.author}>
            <p>ผู้เขียน:</p><h3><Link href="/aboutme">Kiart Tantasi (เพชร)</Link></h3>
            <br/><br/>
            <p>GitHub:</p><a href="https://github.com/kiart-tantasi" target="_blank" rel="noopener noreferrer"><h3>kiart-tantasi</h3></a>
        </div>
    )
}

export default AuthorUI;