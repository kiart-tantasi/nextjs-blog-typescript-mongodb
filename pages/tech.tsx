import type { NextPage } from 'next';
import Head from "next/head";
import Articles from "../components/ฺBlog/Articles";
import { ArticleCard } from '../models/article';

const Tech: NextPage<{articles: ArticleCard[]}> = (props) => {
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