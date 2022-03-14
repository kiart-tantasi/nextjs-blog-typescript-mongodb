import type { NextPage } from 'next';
import Head from 'next/head';
import Articles from '../components/ฺBlog/Articles';
import { ArticleCard } from '../interfaces/article';

const Gaming: NextPage<{articles:ArticleCard[]}> = (props) => {
    const { articles } = props;
    return (
        <>
        <Head>
            <title>เกมมิ่ง | เพชรดอทบล็อก</title>
            <meta name="description" content="บทความเกม แชร์เทคนิคการเล่นที่ทั้งกากและทั้ง(อาจจะ)เก่ง" />
        </Head>
        <Articles articles={articles} heading="ยินดีต้อนรับสู่โลกคนติดเกมส์!" />
        </>
    )
}

export default Gaming;
// --------------------------------------------------------//
import { MongoClient } from "mongodb";
import { transformCardData } from '../lib/transform-data';
import { Article } from '../interfaces/article';

export async function getStaticProps() {
  const dbUrl = process.env.DB_URL as string;
  const client = new MongoClient(dbUrl);
  await client.connect();
  const db = client.db("blogDB");
  const collection = db.collection("gaming");
  const articles = await collection.find({}).toArray() as unknown as Article[];
  const transformedData: ArticleCard[] = await transformCardData(articles, db);

  // CLOSE DB AND RETURN
  client.close();
  return {
    props: {
      articles: transformedData
    },
    revalidate: 10
  }
}