import styles from "./AboutMePage.module.css";
import DOMPurify from "isomorphic-dompurify";

const AboutMePage = (props: { markdown: string }) => {
  return (
    <div
      className={`${styles.bio}`}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props.markdown) }}
    />
  );
};

export default AboutMePage;
