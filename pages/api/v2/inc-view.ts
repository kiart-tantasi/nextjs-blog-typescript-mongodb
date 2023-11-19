import { NextApiRequest, NextApiResponse } from "next";

import { COLLECTION, getMongoClient } from "./articles";
import { Status } from "../../../interfaces/article";
import { databaseNameV2 } from "../../../config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // *ALWAYS RETURN STATUS 200 FOR GOOD UX
  const FIXED_STATUS = 200;

  // VALIDATING BODY
  const { slug } = req.body;
  if (!slug) {
    return res.status(FIXED_STATUS).json({ message: "slug is not found" });
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
        .status(FIXED_STATUS)
        .json({ message: "article is not found." });
    }

    // IF FOUND, CHECK STATUS
    if (article.status !== Status.PUBLIC) {
      return res
        .status(FIXED_STATUS)
        .json({ message: "cannot increment non-public article's views" });
    }

    // INCREMENT
    const views = article.views ? article.views + 1 : 1;
    const message = await collection.findOneAndUpdate(
      { slug },
      { $set: { views: views } }
    );

    // RESPOND
    return res.status(FIXED_STATUS).json({ message });
  } catch (error) {
    return res.status(FIXED_STATUS).json({ message: (error as Error).message });
  } finally {
    // CLOSE DB
    if (connectClient) {
      await client.close();
    }
  }
}
