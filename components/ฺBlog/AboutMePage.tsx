import styles from "./AboutMePage.module.css";
import { Lexer, Parser } from "marked";

const AboutMePage = (props: {markdown:string;} ) => {
    const lexed = Lexer.lex(props.markdown);
    const parsed = Parser.parse(lexed);

    return <div className={`${styles.bio}`}>
        <h2>ประวัติผู้เขียน</h2><br/>
        <div dangerouslySetInnerHTML={{__html: parsed}} />
    </div>
}

export default AboutMePage;