import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { EnvGetter } from "../../../../lib/env-getter";
import isAuthenticated from "../../../../lib/auth-node";
import { allowedCategories } from "../../../../utils/sharedData";
import {
  FindOldVersionForm,
  V2Insert,
  V2Update,
  V2PostToPublic,
  V2MoveToBin,
} from "../../../../interfaces/article";

export enum COLLECTION {
  ARTICLES = "articles",
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
  const client = getMongoClient();
  let connectClient = false;

  // POST A NEW ARTICLE TO WORKSPACE
  if (req.body.postToPublic === false) {
    try {
      // VALIDATING BODY
      const { title, desc, markdown, img, alt } = req.body;
      if (!title || !desc || !markdown || !img || !alt) {
        throw new Error("some data is missing.");
      }

      // CONNECT DB
      await client.connect();
      connectClient = true;
      const db = client.db(getDbName());

      // PREPARE DATA AND INSERT
      const workspaceSlug = slugify(getWorkspaceSlug());
      const toInsert: V2Insert = {
        title,
        desc,
        markdown,
        img,
        alt,
        date: Date.now(),
        slug: workspaceSlug,
        views: 1,
        records: [],
        isWorkspace: true,
        isBin: false,
      };
      const collection = db.collection(COLLECTION.ARTICLES);
      const result = await collection.insertOne(toInsert);

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

      // UPDATE "isWorkspace" and "category"
      const toUpdate: V2PostToPublic = {
        slug,
        category,
        date: Date.now(),
        isWorkspace: false,
        isBin: false,
      };
      const updateResult = await collection.findOneAndUpdate(
        { slug: workspaceSlug },
        { $set: toUpdate }
      );

      // CLOSE DB AND RESPONSE
      client.close();
      return res.status(200).json({
        updateResult,
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
  const client = getMongoClient();
  let connectClient = false;

  try {
    // VALIDATING BODY
    const { category, slug, title, img, alt, desc, markdown } = req.body;
    if (!category || !slug || !title || !img || !alt || !desc || !markdown) {
      throw new Error("some information is missing.");
    }

    // CONNECT DB
    await client.connect();
    connectClient = true;
    const db = client.db(getDbName());

    // FIND EXISTING ARTICLE
    const collection = db.collection(COLLECTION.ARTICLES);
    const old = await collection.findOne({ slug });
    if (old === null) {
      throw new Error("article is not found.");
    }

    // SAVE HISTORY RECORDS
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

    // UPDATE
    const toUpdate: V2Update = {
      title,
      img,
      alt,
      desc,
      markdown,
      records: newRecords,
    };
    const result = await collection.updateOne({ slug }, { $set: toUpdate });

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
  const client = getMongoClient();
  let connectClient = false;

  // MOVE TO BIN
  if (req.body.permanentDelete === false) {
    try {
      // VALIDATING BODY
      const { slug } = req.body;
      if (!slug) {
        throw "slug is missing.";
      }

      // CONNECT DB
      await client.connect();
      connectClient = true;
      const db = client.db(getDbName());
      const collection = db.collection(COLLECTION.ARTICLES);

      // UPDATE "isBin" to true and "isWorkspace" to false
      const toUpdate: V2MoveToBin = {
        isWorkspace: false,
        isBin: true,
      };
      const updateResult = await collection.findOneAndUpdate(
        { slug },
        { $set: toUpdate }
      );

      // CLOSE DB AND SEND RESPONSE
      client.close();
      return res.status(200).json({ updateResult });
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
      const collection = db.collection(COLLECTION.ARTICLES);

      // CHECK EXISTING DATA AND DELETE
      const article = await collection.findOne({ slug });
      if (article === null) {
        throw new Error("article is not found.");
      }
      if (article.isBin !== true) {
        throw new Error("article is not in bin.");
      }
      const deleteResult = await collection.findOneAndDelete({ slug });

      // CLOSE DB AND RESPONSE
      client.close();
      return res.status(200).json({ deleteResult });
    } catch (error) {
      if (connectClient) {
        client.close();
      }
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  // RETURN 400 IF "permanentDelete" IS NOT FOUND
  return res.status(400).json({
    message: "please decribe deleting type (permanentDelet: true/false)",
  });
}

function handleInvalidMethod(res: NextApiResponse) {
  return res.status(404).json({ message: "no matching method." });
}

// ================= [UTILITIES] ================= //

export function getDbName(): string {
  return process.env.OVERRIDING_DB ?? "blog";
}

export function getMongoClient() {
  return new MongoClient(EnvGetter.getDbUrl());
}

function getWorkspaceSlug(): string {
  return (
    "createdAt" +
    new Date().getTime().toString() +
    "randomNum" +
    Math.floor(Math.random() * 1000)
  );
}
