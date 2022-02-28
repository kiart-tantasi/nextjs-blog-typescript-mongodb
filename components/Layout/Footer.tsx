import styles from "./Footer.module.css";

const Footer = () => {
    return (
    <footer className={`${styles.footer} theme-color`}>
        <p className={styles["footer-text"]}>เพชรดอทบล็อก - kiarttantasi@gmail.com</p>
      </footer>
    )
}

export default Footer;