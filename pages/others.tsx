import type { NextPage } from 'next';
import Head from 'next/head';
import Articles from '../components/ฺBlog/Articles';
import { ArticleCard } from '../interfaces/article';

const Others: NextPage<{articles:ArticleCard[]}> = (props) => {
    const { articles } = props;
    return (
        <>
        <Head><title>เรื่องเล่านายเพชร | เพชรดอทบล็อก</title></Head>
        <Articles articles={articles} />
        </>
    )
}

export default Others;
// --------------------------------------------------------//
import { MongoClient } from "mongodb";
import { transformCardData } from '../lib/transform-data';
import { Article } from '../interfaces/article';

export async function getStaticProps() {
  const dbUrl = process.env.DB_URL as string;
  const client = new MongoClient(dbUrl);
  await client.connect();
  const db = client.db("blogDB");
  const collection = db.collection("others");
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