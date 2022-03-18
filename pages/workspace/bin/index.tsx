import type { NextPage } from 'next';
import BinPage from '../../../components/admin/BinPage';
import { ArticleCard } from '../../../interfaces/article';

const ArticleBin: NextPage<{articles: ArticleCard[]}> = (props) => {
  const articles = props.articles;
  return <BinPage articles={articles} />
}

export default ArticleBin;
// ------------------------------------------------------- //
import { MongoClient } from 'mongodb';
import { transformCardData } from '../../../lib/transform-data';
import { Article } from '../../../interfaces/article';

export const getServerSideProps = async() => {
  // CONNECT DB AND WORKSPACE COLLECTION
  const dbUrl = process.env.DB_URL as string;
  const client = new MongoClient(dbUrl);
  await client.connect();
  const db = client.db("blogDB");
  const collection = db.collection("bin");
  const articleNoTransformed = await collection.find({}).toArray() as unknown as Article[];
  const transformedData = await transformCardData(articleNoTransformed, db);

  // CLOSE DB AND RETURN
  client.close();
  return {
    props: {
      articles: transformedData
    }
  }
}