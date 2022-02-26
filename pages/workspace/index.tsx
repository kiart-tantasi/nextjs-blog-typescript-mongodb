import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import LoginPage from '../../components/Admin/LoginPage';
import AdminPage from '../../components/Admin/AdminPage';
import { ArticleCard } from '../../models/article';
import { useContext } from 'react';
import AuthContext from '../../context/auth-context';

const WorkSpace: NextPage<{articles: ArticleCard[]}> = (props) => {
  const articles = props.articles;
  const router = useRouter();
  const AuthCtx = useContext(AuthContext);
  const { logIn, logOut } = AuthCtx;

  const handleLogIn = async(username: string, password: string) => {
    const response = await fetch("/api/login-admin", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({username,password})
    });
    if (!response.ok) {
      alert("โปรดตรวจสอบ username และ password");
    } else {
      alert("เข้าสู่ระบบสำเร็จ");
      logIn();
      router.replace("/workspace");
    }
  }

  const handleLogOut = async() => {
    const response = await fetch("/api/logout-admin", {method:"POST"});
    if (!response.ok) {
      alert("session แอดมินหมดอายุก่อนออกจากระบบ");
    } else {
      alert("ออกจากระบบสำเร็จ");
    }
    logOut();
    router.replace("/workspace");
  }

  if (!articles) return <LoginPage handleLogIn={handleLogIn} />
  return <AdminPage handleLogOut={handleLogOut} articles={articles} />;
}

export default WorkSpace;
// ------------------------------------------------------- //
import { GetServerSidePropsContext, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { removeTokenCookie } from '../../lib/auth-cookie';
import { tokenValidation } from '../../lib/jwt-token-validation';

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