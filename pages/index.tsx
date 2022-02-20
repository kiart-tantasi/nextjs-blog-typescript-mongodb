import type { NextPage } from 'next';
import Articles from '../components/ฺBlog/Articles';
import { Article } from '../models/article';

const Home: NextPage<{articles: Article[]}> = (props) => {
  const articles = props.articles;
  return <Articles articles={articles} />
}

export default Home;
// ---------------------------------------------------------------- //
import { MongoClient } from 'mongodb';

export async function getStaticProps() {
  const dbUrl = process.env.DB_URL as string;
  const client = new MongoClient(dbUrl);
  await client.connect();
  const db = client.db("blogDB");
  const collection = db.collection("main");
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

