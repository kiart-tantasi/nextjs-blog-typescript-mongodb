import type { NextPage } from 'next';
import Head from 'next/head';
import Articles from '../components/ฺBlog/Articles';
import { websiteName } from '../utils/sharedData';
import { ArticleCard } from '../interfaces/article';

const Gaming: NextPage<{articles:ArticleCard[]}> = (props) => {
    const { articles } = props;
    return (
        <>
        <Head>
            <title>{websiteName} - เกมมิ่ง</title>
            <meta name="description" content="บทความเกม แชร์เทคนิคการเล่นที่ทั้งกากและทั้ง(อาจจะ)เก่ง" />
        </Head>
        <Articles articles={articles} heading="ยินดีต้อนรับสู่โลกคนติดเกมส์!" />
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
  client.close();

  // TRANSFORM DATA
  const transformedData: ArticleCard[] = articles.map(x => {
    return {
      _id: x._id.toString(),
      title: x.title,
      desc: x.desc,
      img: x.img,
      alt: x.alt,
      date: x.date,
      category: x.category,
      slug: x.slug
    };
  });
  
  return {
    props: {
      articles: transformedData
    },
    revalidate: 10
  }
}