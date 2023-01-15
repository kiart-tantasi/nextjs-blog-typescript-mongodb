import { Lexer, Parser } from 'marked'
import { NextPage } from 'next'

import AboutMePage from '../components/blog/AboutMePage'
import { bioMarkdown } from '../utils/sharedData'

const AboutMe: NextPage = () => {
    const lexed = Lexer.lex(bioMarkdown)
    const parsed = Parser.parse(lexed)
    return <AboutMePage markdown={parsed} />
}

export default AboutMe
