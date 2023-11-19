import { websiteNameLocal } from '../../config'
import styles from './Footer.module.css'

const Footer = () => {
    return (
        <footer className={`${styles.footer} theme-color`}>
            <p className={styles['footer-text']}>
                {websiteNameLocal} - kiarttantasi@gmail.com
            </p>
        </footer>
    )
}

export default Footer
