import type { NextPage } from 'next';
import Head from "next/head";
import Articles from "../components/blog/Articles";
import { ArticleCard } from '../interfaces/article';

const Tech: NextPage<{articles: ArticleCard[]}> = (props) => {
    const articles = props.articles;
    return (
        <>
        <Head>
            <title>โลกเทค | เพชรดอทบล็อก</title>
            <meta name="description" content="บทความเทคโนโลยี สอนโค้ด สอนเขียนโปรแกรม ด้วยภาษา javascript react nodejs การใช้ database mysql mongodb รวมถึงการ สร้าง api สร้าง backend server ขึ้นเอง" />
        </Head>
        <Articles articles={articles} heading="ยินดีต้อนรับสู่โลกเทค!" />
        </>
    )
}

export default Tech;
// --------------------------------------------------------//
import { MongoClient } from "mongodb";
import { transformCardData } from '../lib/transform-data';
import { Article } from '../interfaces/article';

export async function getStaticProps() {
  const dbUrl = process.env.DB_URL as string;
  const client = new MongoClient(dbUrl);
  await client.connect();
  const db = client.db("blogDB");
  const collection = db.collection("tech");
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