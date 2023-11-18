import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { EnvGetter } from "../../../../lib/env-getter";
import isAuthenticated from "../../../../lib/auth-node";
import {
  FindOldVersionForm,
  V2Insert,
  V2Update,
  V2ToPublic,
  V2ToBin,
  Status,
} from "../../../../interfaces/article";

export enum COLLECTION {
  ARTICLES = "articles",
}

export const getAllowedCategoriesV2 = () => {
  return ["general", "tech", "lifestyle"];
};

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
        return res.status(400).json({ message: "some data is missing." });
      }

      // CONNECT DB
      await client.connect();
      connectClient = true;
      const db = client.db(getDbName());

      // PREPARE DATA AND INSERT
      const toInsert: V2Insert = {
        title,
        desc,
        markdown,
        img,
        alt,
        date: Date.now(),
        slug: getWorkspaceSlug(),
        views: 1,
        status: Status.WORKSPACE,
        records: [],
      };
      const collection = db.collection(COLLECTION.ARTICLES);
      const insertResult = await collection.insertOne(toInsert);

      // CLOSE DB AND RESPONSE
      client.close();
      return res.status(200).json({ insertResult });
    } catch (error) {
      if (connectClient) {
        client.close();
      }
      return res.status(500).json({ message: (error as Error).message });
    }
  }

  // POST A WORKSPACE ARTICLE TO PUBLIC
  if (req.body.postToPublic === true) {
    try {
      // VALIDATING BODY
      const { category, slug, workspaceSlug } = req.body;
      if (!category || !slug || !workspaceSlug) {
        return res.status(400).json({ message: "some data is missing." });
      }

      // VALIDATING CATEGORY
      if (!getAllowedCategoriesV2().includes(category)) {
        return res.status(400).json({ message: "category is not allowed." });
      }

      // CONNECT DB
      await client.connect();
      connectClient = true;
      const db = client.db(getDbName());
      const collection = db.collection(COLLECTION.ARTICLES);

      // CHECK IF ARTICLE EXISTS
      const article = await collection.findOne({ slug: workspaceSlug });
      if (article === null) {
        return res.status(400).json({ message: "article is not found." });
      }

      // CHECK IF SLUG IS ALREADY USED
      const isDuplicate = await collection.findOne({ slug });
      if (isDuplicate) {
        return res.status(400).json({ message: "slug is already used." });
      }

      // UPDATE
      const toUpdate: V2ToPublic = {
        slug,
        category,
        date: Date.now(),
        status: Status.PUBLIC,
      };
      const updateResult = await collection.findOneAndUpdate(
        { slug: workspaceSlug },
        { $set: toUpdate }
      );

      // CLOSE DB AND RESPONSE
      client.close();
      return res.status(200).json({ updateResult });
    } catch (error) {
      if (connectClient) {
        client.close();
      }
      return res.status(500).json({ message: (error as Error).message });
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
      return res.status(400).json({ message: "some data is missing." });
    }

    // CONNECT DB
    await client.connect();
    connectClient = true;
    const db = client.db(getDbName());

    // FIND EXISTING ARTICLE
    const collection = db.collection(COLLECTION.ARTICLES);
    const old = await collection.findOne({ slug });
    if (old === null) {
      return res.status(400).json({ message: "article is not found." });
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
    return res.status(500).json({ message: (error as Error).message });
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
        return res.status(400).json({ message: "slug is missing." });
      }

      // CONNECT DB
      await client.connect();
      connectClient = true;
      const db = client.db(getDbName());
      const collection = db.collection(COLLECTION.ARTICLES);

      // UPDATE
      const toUpdate: V2ToBin = {
        status: Status.BIN,
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
      return res.status(500).json({ message: (error as Error).message });
    }
  }

  // DELETE ARTICLE (PERMANENTLY)
  if (req.body.permanentDelete === true) {
    try {
      // VALIDATING BODY
      const { slug } = req.body;
      if (!slug) {
        return res.status(400).json({ message: "slug is missing." });
      }

      // CONNECT DB
      await client.connect();
      connectClient = true;
      const db = client.db(getDbName());
      const collection = db.collection(COLLECTION.ARTICLES);

      // CHECK EXISTING DATA AND DELETE
      const article = await collection.findOne({ slug });
      if (article === null) {
        return res.status(400).json({ message: "article is not found." });
      }
      if (article.status !== Status.BIN) {
        return res.status(400).json({ message: "article is not in bin." });
      }
      const deleteResult = await collection.findOneAndDelete({ slug });

      // CLOSE DB AND RESPONSE
      client.close();
      return res.status(200).json({ deleteResult });
    } catch (error) {
      if (connectClient) {
        client.close();
      }
      return res.status(500).json({ message: (error as Error).message });
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
