import styles from "./AboutMePage.module.css";

const AboutMePage = (props: {markdown:string;} ) => {
    return <div className={`${styles.bio}`} dangerouslySetInnerHTML={{__html: props.markdown}} />;
}

export default AboutMePage;