import type { NextPage } from 'next';
import Head from 'next/head';
import BlogPage from '../components/ฺBlog/BlogPage';
import { Article } from '../models/article';

const English: NextPage<{articles:Article[]}> = (props) => {
    const { articles } = props;

    return (
        <>
        <Head>
            <title>เพชร The Blog - ภาษาอังกฤษ</title>
            <meta name="description" content="บทความสอนภาษาอังกฤษ ทั้งเน้นการใช้งานจริง และสอนภาษาอังกฤษ-ภาษาศาสตร์เชิงลึก" />
        </Head>
        <BlogPage articles={articles} heading="Let's Learn English!" />
        </>
    )
}

export default English;
// --------------------------------------------------------//
import { MongoClient } from "mongodb";

export async function getStaticProps() {
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("english");
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