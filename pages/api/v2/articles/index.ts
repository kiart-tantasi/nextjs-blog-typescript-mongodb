import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { EnvGetter } from "../../../../lib/env-getter";
import isAuthenticated from "../../../../lib/auth-node";
import { allowedCategories } from "../../../../utils/sharedData";

export default isAuthenticated(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // DB CONFIG
  const dbUrl = EnvGetter.getDbUrl();
  const client = new MongoClient(dbUrl);
  let connectClient = false;

  // ---- POST METHODS ---- //

  // VALIDATING BODY
  if (req.method === "POST" && req.body.postToPublic === undefined) {
    return res.status(500).json({
      message: "please decribe posting type (postToPublic: true/false)",
    });
  }

  // POST A NEW ARTICLE
  else if (req.method === "POST" && req.body.postToPublic === false) {
    try {
      // CHECK REQUEST DATA
      const { title, desc, markdown, img, alt } = req.body;
      if (!title || !desc || !markdown || !img || !alt) {
        throw new Error("some information is missing.");
      }

      // CONNECT DB
      await client.connect();
      connectClient = true;
      const db = client.db(getDbName());

      // PREPARE DATA
      const workspaceSlug = slugify(getWorkspaceSlug());
      const toInsert = {
        title,
        desc,
        markdown,
        img,
        alt,
        date: Date.now(),
        category: "workspace",
        slug: workspaceSlug,
        views: 1,
        record: [],
      };

      // INSERT INTO WORKSPACE CATEGORY
      const workspace = db.collection("workspace");
      const result = await workspace.insertOne(toInsert);

      // CLOSE DB AND RESPONSE
      client.close();
      res.status(200).json({ message: result });
    } catch (error) {
      // CLOSE DB BEFORE RESPONSE 400 IN SOME CASES
      if (connectClient) {
        client.close();
      }
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // POST A WORKSPACE ARTICLE TO PUBLIC
  else if (req.method === "POST" && req.body.postToPublic === true) {
    try {
      // VALIDATIING BODY
      const { category, slug, workspaceSlug } = req.body;
      if (!category || !slug || !workspaceSlug) {
        throw new Error("some information is missing.");
      }
      if (!allowedCategories.includes(category) || category === "workspace") {
        throw new Error("category not allowed");
      }

      // CONNECT DB
      await client.connect();
      connectClient = true;
      const db = client.db(getDbName());

      // CHECK IF SLUG IS ALREADY USED
      const articlesCollection = db.collection(collectionName.articles);
      const isDuplicate = await articlesCollection.findOne({ slug: slug });
      if (isDuplicate) {
        throw new Error("slug is already used.");
      }

      // FIND AND GET ARTICLE FROM WORKSPACE
      const workspace = db.collection("workspace");
      const articleFromWorkspace = await workspace.findOne({
        slug: workspaceSlug,
      });

      // PREPARE DATA
      const articleToPostToPublic = {
        title: articleFromWorkspace!.title,
        desc: articleFromWorkspace!.desc,
        markdown: articleFromWorkspace!.markdown,
        img: articleFromWorkspace!.img,
        alt: articleFromWorkspace!.alt,
        date: Date.now(),
        category: category,
        slug: slug,
        views: 1,
        record: articleFromWorkspace?.record || [],
      };

      // INSERT INTO COLLECTION "articles"
      const insertResult = await articlesCollection.insertOne(
        articleToPostToPublic
      );

      // DELETE IN WORKSPACE
      const workspaceDeleteResult = await workspace.deleteOne({
        slug: workspaceSlug,
      });

      // CLOSE DB AND RESPONSE
      client.close();
      res.status(200).json({
        insertResult,
        workspaceDeleteResult,
      });
    } catch (error) {
      // CLOSE DB BEFORE RESPONSE ERROR
      if (connectClient) client.close();
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }

  // ---- PUT METHODS ---- //
  // ---- DELETE METHODS ---- //

  // NO MATCHING METHOD
  else {
    res.status(404).json({ message: "no matching method." });
  }
});

function getWorkspaceSlug(): string {
  return (
    "workspace" +
    new Date().getTime().toString() +
    "randomNum" +
    Math.floor(Math.random() * 1000)
  );
}

function getDbName(): string {
  return process.env.OVERRIDING_DB ?? "blogDB";
}

const collectionName = {
  articles: "articles",
};
