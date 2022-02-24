import { NextPage } from "next";
import ArticleDetail from "../../components/ฺBlog/ArticleDetail";
import NotFoundPage from "../../components/ฺBlog/NotFoundPage";
import { Article } from "../../models/article";

const Article: NextPage<{article: Article}> = (props) => {
    const article = props.article;
    if (article) {
        return <ArticleDetail title={article.title} desc={article.desc} img={article.img} alt={article.alt} date={article.date} markdown={article.markdown} category={article.category} slug={article.slug} views={article.views} />
    }
    return <NotFoundPage />
}

export default Article;
//--------------------------------//
import { GetServerSidePropsContext, NextApiResponse } from "next";
import { tokenValidation } from "../../utils/jwt-token-validation";
import { removeTokenCookie } from "../../utils/auth-cookie";
import { MongoClient } from "mongodb";
import { Lexer, Parser } from "marked";

export const getServerSideProps = async(context: GetServerSidePropsContext) => {

    // CHECK TOKEN - IF INVALID, RETURN NULL AND REMOVE TOKEN IN COOKIE
    const token = context.req.cookies.token;
    let result = tokenValidation(token);
    if (result === false) {
        const response = context.res as NextApiResponse;
        removeTokenCookie(response);
        return {props: {}}
    }

    // CONNECT DB AND COLLECTION
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("workspace");

    // FIND THE ARTICLE AND CLOSE DB
    const slug = context.params!.slug;
    const articleNoTransformed = await collection.findOne({slug: slug});
    client.close();

    // IMMEDIATELY RETURN IF ARTICLE MATCHED TO SLUG IS NOT FOUND
    if (articleNoTransformed === null) return {props: {}};

    // TRANSFORM DATA
    const lexedMarkdown = Lexer.lex(articleNoTransformed.markdown);
    const parsedMarkdown = Parser.parse(lexedMarkdown);
    const transformedData = {...articleNoTransformed, _id: articleNoTransformed!._id.toString(), markdown: parsedMarkdown};

    return {
        props:{
            article: transformedData
        }
    }
}