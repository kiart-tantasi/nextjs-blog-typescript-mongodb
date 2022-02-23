import type { NextPage } from 'next';
import Head from "next/head";
import Articles from "../components/ฺBlog/Articles";
import { Article } from '../models/article';

const Tech: NextPage<{articles: Article[]}> = (props) => {
    const articles = props.articles;
    return (
        <>
        <Head>
            <title>เพชร BLOG - เทคโนโลยี</title>
            <meta name="description" content="บทความเทคโนโลยี รีวิวสินค้า สอนโค้ด สอนเขียนโปรแกรม ด้วยภาษา javascript react nodejs การใช้ database mysql mongodb รวมถึงการ สร้าง api สร้าง backend server ขึ้นเอง" />
        </Head>
        <Articles articles={articles} heading="ยินดีต้อนรับสู่โลกเทค!" />
        </>
    )
}

export default Tech;
// --------------------------------------------------------//
import { MongoClient } from "mongodb";

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