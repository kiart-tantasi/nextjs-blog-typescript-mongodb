import type { NextPage } from 'next';
import BlogPage from '../components/ฺBlog/BlogPage';
import { MongoClient } from 'mongodb';
import { Article } from '../models/article';

const Home: NextPage<{articles: Article[]}> = (props) => {
  const articles = props.articles;
  return <BlogPage articles={articles} />
}

export default Home;
// ---------------------------------------------------------------- //
import { oldArticleOnMongoDb } from '../utilities/dummy-data';
import { dbUrl } from "../ignoreme";

export async function getStaticProps() {
  const client = new MongoClient(dbUrl);
  await client.connect();
  const db = client.db("blogDB");
  const collection = db.collection("main");
  const articles = await collection.find({}).toArray();
  const transformedData = articles.map(x => {
    return {
      id: x._id.toString(),
      title: x.title,
      desc: x.desc,
      markdown: x.markdown,
      date: x.date,
      img: x.img,
      alt: x.alt
    }
  });
  
  client.close();
  return {
    props: {
      articles: [...oldArticleOnMongoDb,...transformedData]
    },
    revalidate: 20
  }
}

