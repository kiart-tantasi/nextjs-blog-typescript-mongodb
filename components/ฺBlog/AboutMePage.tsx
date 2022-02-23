import styles from "./AboutMePage.module.css";
import { Lexer, Parser } from "marked";
import { useEffect } from "react";

const AboutMePage = (props: {markdown:string; img: string; alt: string} ) => {
    const lexed = Lexer.lex(props.markdown);
    const parsed = Parser.parse(lexed);

    useEffect(() => console.log(parsed),[])

    return <div className={`${styles.bio}`}>
        <h2>ประวัติผู้เขียน</h2><br/>
        <img src={props.img} alt={props.alt} />
        <div dangerouslySetInnerHTML={{__html: parsed}} />
    </div>
}

export default AboutMePage;