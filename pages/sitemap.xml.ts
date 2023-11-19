//ref: https://nextjs.org/learn-pages-router/seo/crawling-and-indexing/xml-sitemaps
import { GetServerSidePropsContext } from "next";
import { EnvGetter } from "../lib/env-getter";
import { MongoClient } from "mongodb";
import { Article } from "../interfaces/article";
import { databaseNameV1 } from "../config";

function generateSiteMap(articles: Article[]) {
  const domain: string = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- static urls -->
    <url>
      <loc>${domain}/</loc>
      <priority>1.00</priority>
    </url>
    <url>
      <loc>${domain}/HowIBuildThisWebsite</loc>
      <priority>0.64</priority>
    </url>
    <url>
      <loc>${domain}/aboutme</loc>
      <priority>0.64</priority>
    </url>
    <!-- dynamic urls -->
    ${articles.map(
      (article) =>
        `<url>
        <loc>${domain.concat(`/article/${article.slug}`)}</loc>
        <priority>0.80</priority>
      </url>`
    )}
  </urlset>
 `;
}

export default function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  try {
    const dbUrl = EnvGetter.getDbUrl();
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db(databaseNameV1);
    const collection = db.collection("main"); // TODO: get from collection articles when using v2
    const articlesFromDB = await collection.find({}).toArray();
    const sitemap = generateSiteMap(
      articlesFromDB as unknown as Article[] // TODO: stop using unknown
    );
    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
  } catch (error) {
    res.statusCode = 500;
    console.log("error:", error);
  }
  res.end();
  return { props: {} };
}
