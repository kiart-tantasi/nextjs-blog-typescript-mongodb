//ref: https://nextjs.org/learn-pages-router/seo/crawling-and-indexing/xml-sitemaps
import { GetServerSidePropsContext } from "next";
import { EnvGetter } from "../lib/env-getter";
import { MongoClient } from "mongodb";
import { Article } from "../interfaces/article";

function generateSiteMap(articles: Article[]) {
  const domain: string = process.env.PUBLIC_DOMAIN || "http://localhost:3000";
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

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  try {
    const dbUrl = EnvGetter.getDbUrl();
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("main"); // TODO: get from collection articles when using v2
    const articlesFromDB = await collection.find({}).toArray();
    const sitemap = generateSiteMap(
      articlesFromDB as unknown as Article[] // TODO: stop using unknown
    );
    res.setHeader("Content-Type", "text/xml");
    // we send the XML to the browser
    res.write(sitemap);
  } catch (error) {
    console.log("error:", error);
  } finally {
    res.end();
  }

  return {
    props: {},
  };
}

export default SiteMap;
