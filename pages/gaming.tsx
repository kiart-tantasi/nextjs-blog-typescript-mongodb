import type { NextPage } from 'next';
import Head from 'next/head';
import BlogPage from '../components/ฺBlog/BlogPage';
import { Article } from '../models/article';

const Gaming: NextPage<{articles:Article[]}> = (props) => {
    const { articles } = props;
    return (
        <>
        <Head>
            <title>เพชร The Blog - เกมมิ่ง</title>
            <meta name="description" content="บทความเกมที่เพชรเล่น และแชร์เทคนิคการเล่นที่ทั้งกากและทั้ง(อาจจะ)เก่ง" />
        </Head>
        <BlogPage articles={articles} heading="ยินดีต้อนรับสู่โลกคนติดเกมส์!" />
        </>
    )
}

export default Gaming;
// --------------------------------------------------------//
import { MongoClient } from "mongodb";

export async function getStaticProps() {
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("gaming");
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