import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { EnvGetter } from "../../../../lib/env-getter";
import isAuthenticated from "../../../../lib/auth-node";
import { allowedCategories } from "../../../../utils/sharedData";
import {
  FindOldVersionForm,
  SetDataFormV2,
} from "../../../../interfaces/article";

export enum COLLECTION {
  ARTICLES = "articles",
  WORKSPACE_ARTICLES = "workspaceArticles",
  BIN_ARTICLES = "binArticles",
}

export default isAuthenticated(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await handlePost(req, res);
    case "PUT":
      return await handlePut(req, res);
    case "DELETE":
      return await handleDelete(req, res);
    default:
      return handleInvalidMethod(res);
  }
});

// ================= [HANDLE REQUEST BASED ON METHOD] ================= //

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // DB CONFIG
  const dbUrl = EnvGetter.getDbUrl();
  const client = new MongoClient(dbUrl);
  let connectClient = false;

  // POST A NEW ARTICLE TO WORKSPACE
  if (req.body.postToPublic === false) {
    try {
      // VALIDATING BODY
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
        records: [],
      };

      // INSERT INTO COLLECTION "workspaceArticles"
      const workspace = db.collection(COLLECTION.WORKSPACE_ARTICLES);
      const result = await workspace.insertOne(toInsert);

      // CLOSE DB AND RESPONSE
      client.close();
      return res.status(200).json({ message: result });
    } catch (error) {
      if (connectClient) {
        client.close();
      }
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  // POST A WORKSPACE ARTICLE TO PUBLIC
  if (req.body.postToPublic === true) {
    try {
      // VALIDATING BODY
      const { category, slug, workspaceSlug } = req.body;
      if (!category || !slug || !workspaceSlug) {
        throw new Error("some information is missing.");
      }

      // VALIDATING CATEGORY
      if (!allowedCategories.includes(category) || category === "workspace") {
        throw new Error("category is not allowed");
      }

      // CONNECT DB
      await client.connect();
      connectClient = true;
      const db = client.db(getDbName());

      // CHECK IF SLUG IS ALREADY USED
      const collection = db.collection(COLLECTION.ARTICLES);
      const isDuplicate = await collection.findOne({ slug });
      if (isDuplicate) {
        throw new Error("slug is already used.");
      }

      // FIND AND GET ARTICLE FROM WORKSPACE
      const workspace = db.collection(COLLECTION.WORKSPACE_ARTICLES);
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
        category,
        slug,
        views: 1,
        records: articleFromWorkspace?.records || [],
      };

      // INSERT INTO COLLECTION "articles"
      const insertResult = await collection.insertOne(articleToPostToPublic);

      // DELETE IN WORKSPACE
      const workspaceDeleteResult = await workspace.deleteOne({
        slug: workspaceSlug,
      });

      // CLOSE DB AND RESPONSE
      client.close();
      return res.status(200).json({
        insertResult,
        workspaceDeleteResult,
      });
    } catch (error) {
      if (connectClient) {
        client.close();
      }
      const err = error as Error;
      return res.status(400).json({ message: err.message });
    }
  }

  // RETURN 400 IF "postToPublic" IS NOT FOUND
  return res.status(400).json({
    message: "please decribe posting type (postToPublic: true/false)",
  });
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  // DB CONFIG
  const dbUrl = EnvGetter.getDbUrl();
  const client = new MongoClient(dbUrl);
  let connectClient = false;

  try {
    // VALIDATING BODY
    const { category, slug, title, img, alt, desc, markdown } = req.body;
    if (!category || !slug || !title || !img || !alt || !desc || !markdown) {
      throw new Error("some information is missing.");
    }

    // CHOOSE COLLECTION BETWEEN "workspace" AND "articles"
    const collectionName =
      category === "workspace"
        ? COLLECTION.WORKSPACE_ARTICLES
        : COLLECTION.ARTICLES;

    // CONNECT DB
    await client.connect();
    connectClient = true;
    const db = client.db(getDbName());

    // FIND EXISTING ARTICLE
    const collection = db.collection(collectionName);
    const old = await collection.findOne({ slug });
    if (old === null) {
      throw new Error("article is not found.");
    }

    // TRANSFORM OLD VERSION AND PUSH INTO RECORDS
    const recordToPush: FindOldVersionForm = {
      id: old._id.toString(),
      title: old.title,
      desc: old.desc,
      markdown: old.markdown,
      img: old.img,
      alt: old.alt,
      date: old.date,
      category: old.category,
      slug: old.slug,
      views: old?.views || 1,
      editDate: Date.now(),
    };
    const newRecords = old.records || [];
    newRecords.push(recordToPush);

    // PREPARE DATA TO UPDATE
    const newData: SetDataFormV2 = {
      title,
      img,
      alt,
      desc,
      markdown,
      records: newRecords,
    };

    // UPDATE
    const result = await collection.updateOne({ slug }, { $set: newData });

    // CLOSE DB AND SEND RESPONSE
    client.close();
    return res.status(200).json({
      message: result,
    });
  } catch (error) {
    if (connectClient) {
      client.close();
    }
    return res.status(400).json({ message: (error as Error).message });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  // DB CONFIG
  const dbUrl = EnvGetter.getDbUrl();
  const client = new MongoClient(dbUrl);
  let connectClient = false;

  // VALIDATING "permanentDelete"
  if (req.body.permanentDelete === undefined) {
    return res.status(500).json({
      message: "please decribe deleting type (permanentDelet: true/false)",
    });
  }

  // DELETE AN ARTICLE (MOVE TO BIN)
  if (req.body.permanentDelete === false) {
    try {
      // VALIDATING BODY
      const { slug, category } = req.body;
      if (!slug || !category) {
        throw "slug or category is missing.";
      }

      // CONNECT DB
      await client.connect();
      connectClient = true;
      const db = client.db(getDbName());
      const collectionName =
        category === "workspace"
          ? COLLECTION.WORKSPACE_ARTICLES
          : COLLECTION.ARTICLES;

      const collection = db.collection(collectionName);
      const toDelete = await collection.findOne({ slug });

      // PREPARE DATA TO INSERT INTO BIN
      const toInsert = {
        title: toDelete?.title,
        desc: toDelete?.desc,
        markdown: toDelete?.markdown,
        img: toDelete?.img,
        alt: toDelete?.alt,
        date: toDelete?.date,
        category: toDelete?.category,
        slug: toDelete?.slug,
        views: toDelete?.views || 1,
        records: toDelete?.records || [],
      };

      // INSERT INTO BIN
      const bin = db.collection(COLLECTION.BIN_ARTICLES);
      const binInsertResult = await bin.insertOne(toInsert);

      // DELETE IN PREVIOUS COLLECTION
      const deleteResult = await collection.deleteOne({ slug });

      // CLOSE DB AND SEND RESPONSE
      client.close();
      return res.status(200).json({
        binInsertResult,
        deleteResult,
      });
    } catch (error) {
      if (connectClient) {
        client.close();
      }
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  // DELETE ARTICLE (PERMANENTLY)
  if (req.body.permanentDelete === true) {
    try {
      // VALIDATING BODY
      const { slug } = req.body;
      if (!slug) {
        throw new Error("slug is missing.");
      }

      // CONNECT DB
      await client.connect();
      connectClient = true;
      const db = client.db(getDbName());
      const bin = db.collection(COLLECTION.BIN_ARTICLES);

      // DELETE FROM BIN COLLECTION
      const permanentDeleteResult = await bin.deleteOne({ slug: slug });

      // CLOSE DB AND RESPONSE
      client.close();
      return res.status(200).json({ message: permanentDeleteResult });
    } catch (error) {
      if (connectClient) {
        client.close();
      }
      return res.status(400).json({ message: (error as Error).message });
    }
  }
}

function handleInvalidMethod(res: NextApiResponse) {
  return res.status(404).json({ message: "no matching method." });
}

// ================= [UTILITIES] ================= //

function getWorkspaceSlug(): string {
  return (
    "createdAt" +
    new Date().getTime().toString() +
    "randomNum" +
    Math.floor(Math.random() * 1000)
  );
}

function getDbName(): string {
  return process.env.OVERRIDING_DB ?? "blogDB";
}
