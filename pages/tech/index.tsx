import type { NextPage } from 'next';
import Head from "next/head";
import BlogPage from "../../components/ฺBlog/BlogPage";

const Tech: NextPage<{articles: Article[]}> = (props) => {
    const articles = props.articles;
    return (
        <>
        <Head><title>เพชร The Blog - เทคโนโลยี</title></Head>
        <BlogPage articles={articles} heading="ยินดีต้อนรับสู่โลกเทค!" />
        </>
    )
}

export default Tech;
// --------------------------------------------------------//
import { MongoClient } from "mongodb";
import { Article } from '../../models/article';

export async function getStaticProps() {
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("tech");
    const articles = await collection.find({}).toArray();
    const transformedData = articles.map(x => {
      return {...x, _id: x._id.toString()}
    });
    
    client.close();
    return {
      props: {
        articles: [...transformedData]
      },
      revalidate: 10
    }
  }