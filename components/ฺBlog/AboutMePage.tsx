import styles from "./AboutMePage.module.css";
import { Lexer, Parser } from "marked";

const AboutMePage = (props: {markdown:string;} ) => {
    const lexed = Lexer.lex(props.markdown);
    const parsed = Parser.parse(lexed);

    return <div className={`${styles.bio}`} dangerouslySetInnerHTML={{__html: parsed}} />;
}

export default AboutMePage;