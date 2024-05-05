import { NextApiRequest, NextApiResponse } from "next";

import { COLLECTION, getMongoClient } from "./articles";
import { Status } from "../../../interfaces/article";
import { databaseNameV2 } from "../../../config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // VALIDATING BODY
  const { slug } = req.body;
  if (!slug) {
    return res.status(400).json({ message: "slug is not found" });
  }

  const client = getMongoClient();
  let connectClient = false;
  try {
    // CONNECT DB AND FIND ARTICLE
    await client.connect();
    connectClient = true;
    const db = client.db(databaseNameV2);
    const collection = db.collection(COLLECTION.ARTICLES);
    const article = await collection.findOne({ slug });

    // IF ARTICLE IS NOT FOUND
    if (article === null) {
      return res
        .status(400)
        .json({ message: "article is not found." });
    }

    // IF FOUND, CHECK STATUS
    if (article.status !== Status.PUBLIC) {
      return res
        .status(400)
        .json({ message: "cannot increment non-public article's views" });
    }

    // INCREMENT
    const views = article.views ? article.views + 1 : 1;
    const message = await collection.findOneAndUpdate(
      { slug },
      { $set: { views: views } }
    );

    // RESPOND
    return res.status(200).json({ message });
  } catch (error) {
    console.error((error as Error).message);
    return res.status(500).end();
  } finally {
    // CLOSE DB
    if (connectClient) {
      await client.close();
    }
  }
}
