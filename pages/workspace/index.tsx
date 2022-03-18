import type { NextPage } from 'next';
import LoginPage from '../../components/admin/LoginPage';
import AdminPage from '../../components/admin/AdminPage';
import { ArticleCard } from '../../interfaces/article';

const WorkSpace: NextPage<{articles: ArticleCard[]}> = (props) => {
  const articles = props.articles;
  if (!articles) return <LoginPage />
  return <AdminPage articles={articles} />;
}

export default WorkSpace;
// ------------------------------------------------------- //
import { GetServerSidePropsContext, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { removeTokenCookie } from '../../lib/auth-cookie';
import { tokenValidation } from '../../lib/jwt-token-validation';
import { transformCardData } from '../../lib/transform-data';
import { Article } from '../../interfaces/article';

export const getServerSideProps = async(context: GetServerSidePropsContext) => {
  // CHECK TOKEN - IF INVALID, RETURN NULL AND REMOVE TOKEN IN COOKIE
  const token = context.req.cookies.token;
  let result = tokenValidation(token);
  if (result === false) {
    const response = context.res as NextApiResponse;
    removeTokenCookie(response);
    return {props: {}}
  }

  // CONNECT DB AND WORKSPACE COLLECTION
  const dbUrl = process.env.DB_URL as string;
  const client = new MongoClient(dbUrl);
  await client.connect();
  const db = client.db("blogDB");
  const collection = db.collection("workspace");
  const articleNoTransformed = await collection.find({}).toArray() as unknown as Article[];
  const transformedData: ArticleCard[] = await transformCardData(articleNoTransformed, db);

  // CLOSE DB AND RETURN
  client.close();
  return {
    props: {
      articles: transformedData
    }
  }
}