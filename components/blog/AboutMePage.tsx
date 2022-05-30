import { useEffect, useState } from "react";
import styles from "./AboutMePage.module.css";

import domPurify from "dompurify";

const AboutMePage = (props: {markdown:string;} ) => {
    const [sanitizedMarkdown, setSanitizedMarkdown] = useState<string>("");

    useEffect(() => {
        const DomPurify = domPurify(window);
        const sanitizedHtml = DomPurify.sanitize(props.markdown);
        setSanitizedMarkdown(sanitizedHtml);
    }, []);

    return <div className={`${styles.bio}`} dangerouslySetInnerHTML={{__html: sanitizedMarkdown}} />;
}

export default AboutMePage;
