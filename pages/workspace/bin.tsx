import type { NextPage } from 'next';
import BinPage from '../../components/Admin/BinPage';
import { ArticleCard } from '../../interfaces/article';

const WorkSpace: NextPage<{articles: ArticleCard[]}> = (props) => {
  const articles = props.articles;
  return <BinPage articles={articles} />
}

export default WorkSpace;
// ------------------------------------------------------- //
import { MongoClient } from 'mongodb';

export const getServerSideProps = async() => {
  // CONNECT DB AND WORKSPACE COLLECTION
  const dbUrl = process.env.DB_URL as string;
  const client = new MongoClient(dbUrl);
  await client.connect();
  const db = client.db("blogDB");
  const collection = db.collection("bin");

  // FIND WORKSPACE ARTICLES AND CLOSE DB
  const articleNoTransformed = await collection.find({}).toArray();
  client.close();

  // TRANSFORM DATA
  const transformedData: ArticleCard[] = articleNoTransformed.map(x => {
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
    }
  }
}