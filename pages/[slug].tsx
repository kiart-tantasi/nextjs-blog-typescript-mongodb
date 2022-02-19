import ArticleDetail from "../components/ฺBlog/ArticleDetail";
import { Article } from "../models/article";

const Article: NextPage<{article: Article}> = (props) => {
    const { article } = props;
    return <ArticleDetail title={article.title} desc={article.desc} img={article.img} alt={article.img} date={article.date} markdown={article.markdown} category={article.category} slug={article.slug} />
}
// return <ArticleDetail title="หัวข้อบทความ" desc="คำอธิบายบทความ" img="https://i.ytimg.com/vi/L2ZxBtC9DjQ/maxresdefault.jpg" alt="หมาน้อย" date={new Date().getTime()} markdown="เนื้อหาบทความเนื้อหาบทความเนื้อหาบทความ เนื้อหาบทความเนื้อหาบทความเนื้อหาบทความ เนื้อหาบทความเนื้อหาบทความเนื้อหาบทความ" category="others" slug="บทความ" />

export default Article;
// ------------------------------------------------------- //
import { MongoClient } from "mongodb";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
const dbUrl = process.env.DB_URL as string;

export const getStaticPaths: GetStaticPaths = async() => {
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("main");
    const articles = await collection.find({}).toArray();
    const paths = articles.map(x => {
        return {params: {slug: x.title}}
    });

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
    const objectIdAsString = articleNoTransformed!._id.toString();
    const article = {...articleNoTransformed, _id: objectIdAsString}

    return {
        props: { article }
    }
}
