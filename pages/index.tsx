import { MongoClient } from "mongodb";
import type { NextPage } from "next";

import Articles from "../components/blog/Articles";
import { Article, ArticleCard } from "../interfaces/article";
import { EnvGetter } from "../lib/env-getter";
import { transformCardData } from "../lib/transform-data";
import Head from "next/head";
import { databaseNameV1 } from "../config";

interface PageProps {
  articles: ArticleCard[];
}

const Home: NextPage<{ articles: ArticleCard[] }> = (props: PageProps) => {
  const articles = props.articles;
  return (
    <>
      <Head>
        <link rel="canonical" href="https://www.petchblog.net/" />
        {/* temp meta */}
        <meta name="agd-partner-manual-verification" />
      </Head>
      <Articles articles={articles} />
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const dbUrl = EnvGetter.getDbUrl();
  const client = new MongoClient(dbUrl);

  let articles: ArticleCard[] = [];
  try {
    await client.connect();
    const db = client.db(databaseNameV1);
    const collection = db.collection("main");
    const articlesFromDB = await collection.find({}).toArray();
    articles = await transformCardData(
      articlesFromDB as unknown as Article[],
      db
    );
    client.close();
  } catch (error) {
    client.close();
  }
  return {
    props: {
      articles,
    },
    revalidate: 10,
  };
}
