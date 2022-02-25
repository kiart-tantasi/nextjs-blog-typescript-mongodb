import type { NextPage } from 'next';
import Articles from '../components/ฺBlog/Articles';
import { ArticleCard } from '../models/article';

const Home: NextPage<{articles: ArticleCard[]}> = (props) => {
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