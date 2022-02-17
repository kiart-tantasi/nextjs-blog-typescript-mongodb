import type { NextPage } from 'next';
import BlogPage from '../components/ฺBlog/BlogPage';
import { MongoClient } from 'mongodb';
import { Article } from '../models/article';

const Home: NextPage<{articles: Article[]}> = (props) => {
  const articles = props.articles;
  return <BlogPage articles={articles} />
}

export default Home;

export async function getStaticProps() {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();
  const db = client.db("blogDB");
  const collection = db.collection("articles");
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
      articles: transformedData
    },
    revalidate: 5
  }
}

