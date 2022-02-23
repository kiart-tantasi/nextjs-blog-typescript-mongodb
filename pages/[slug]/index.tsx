import ArticleDetail from "../../components/ฺBlog/ArticleDetail";
import NotFoundPage from "../../components/ฺBlog/NotFoundPage";
import { Article } from "../../models/article";

const Article: NextPage<{article: Article}> = (props) => {
    const { article } = props;

    if (article !== null) {
        return <ArticleDetail title={article.title} desc={article.desc} img={article.img} alt={article.alt} date={article.date} markdown={article.markdown} category={article.category} slug={article.slug} views={article.views} />
    }
    return <NotFoundPage />;
}

export default Article;
// ------------------------------------------------------- //
import { MongoClient } from "mongodb";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Lexer, Parser } from "marked";

const dbUrl = process.env.DB_URL as string;

export const getStaticPaths: GetStaticPaths = async() => {
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("main");
    const articles = await collection.find({}).toArray();
    const paths = articles.map(x => {
        return {params: {slug: x.slug}}
    });
    client.close();

    return {
        paths: paths,
        fallback: "blocking"
    };
}

export const getStaticProps: GetStaticProps = async(context) => {
    const slug = context.params!.slug;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("main");
    const articleNoTransformed = await collection.findOne({slug:slug});
    if (articleNoTransformed === null) return {props: {article : null }};
    const objectIdAsString = articleNoTransformed!._id.toString();

    const markdownNoTransformed = articleNoTransformed.markdown;
    const lexed = Lexer.lex(markdownNoTransformed);
    const parsedMarkdown = Parser.parse(lexed);
    const article = {...articleNoTransformed, _id: objectIdAsString, markdown: parsedMarkdown};
    client.close();

    return {
        props: { article },
        revalidate: 10
    }
}