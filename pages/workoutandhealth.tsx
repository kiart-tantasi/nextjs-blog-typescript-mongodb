import type { NextPage } from 'next';
import Head from 'next/head';
import Articles from '../components/ฺBlog/Articles';
import { websiteName } from '../utils/sharedData';
import { ArticleCard } from '../interfaces/article';

const WorkoutAndHealth:NextPage<{articles:ArticleCard[]}> = (props) => {
    const { articles } = props;
    return (
        <>
        <Head><title>ออกกำลังกายและสุขภาพ | เพชรดอทบล็อก</title></Head>
        <Articles articles={articles} heading="ออกกำลังกายกัน!" />
        </>
    )
}

export default WorkoutAndHealth;
// --------------------------------------------------------//
import { MongoClient } from "mongodb";

export async function getStaticProps() {
  const dbUrl = process.env.DB_URL as string;
  const client = new MongoClient(dbUrl);
  await client.connect();
  const db = client.db("blogDB");
  const collection = db.collection("workoutandhealth");
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