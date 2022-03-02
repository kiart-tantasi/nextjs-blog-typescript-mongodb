import { NextPage } from "next";
import { Lexer, Parser } from "marked";
import AboutMePage from "../components/ฺBlog/AboutMePage";
import { bioMarkdown } from "../utils/sharedData";

const AboutMe:NextPage = () => {
    const lexed = Lexer.lex(bioMarkdown);
    const parsed = Parser.parse(lexed);
    return <AboutMePage markdown={parsed} />
}

export default AboutMe;