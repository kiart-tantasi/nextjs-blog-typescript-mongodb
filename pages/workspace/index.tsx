import type { NextPage } from 'next';
import Head from 'next/head';
import Articles from '../../components/ฺBlog/Articles';
import { Article } from '../../models/article';
import NotFoundPage from '../../components/ฺBlog/NotFoundPage';

const WorkSpace: NextPage<{articles: Article[]}> = (props) => {
  const articles = props.articles;

  if (!articles) return <NotFoundPage />
  return (
      <>
      <Head><title>WORKSPACE</title></Head>
      <Articles articles={articles} />
      </>
  )
}

export default WorkSpace;
// ------------------------------------------------------- //
import { GetServerSidePropsContext, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { removeTokenCookie } from '../../utils/auth-cookie';
import { tokenValidation } from '../../utils/jwt-token-validation';

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

  // FIND WORKSPACE ARTICLES AND CLOSE DB
  const articleNoTransformed = await collection.find({}).toArray();
  client.close();

  // TRANSFORM DATA
  const transformedData = articleNoTransformed.map(x => {
    return {...x, _id: x._id.toString()};
  });

  return {
    props: {
      articles: transformedData
    }
  }

}