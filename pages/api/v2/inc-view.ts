import { NextApiRequest, NextApiResponse } from "next";

import { COLLECTION, getDbName, getMongoClient } from "./articles";
import { Status } from "../../../interfaces/article";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // *ALWAYS RETURN STATUS 200 FOR GOOD UX
  // VALIDATING BODY
  const { slug } = req.body;
  if (!slug) {
    return res.status(200).json({ message: "slug is not found" });
  }

  const client = getMongoClient();
  try {
    // CONNECT DB AND FIND ARTICLE
    await client.connect();
    const db = client.db(getDbName());
    const collection = db.collection(COLLECTION.ARTICLES);
    const article = await collection.findOne({ slug });

    // IF ARTICLE IS NOT FOUND
    if (article === null) {
      throw new Error("article is not found.");
    }

    // IF FOUND, CHECK STATUS
    if (article.status !== Status.PUBLIC) {
      return res.status(200).json({
        message:
          "article is not public. as a result, views will not be incremented",
      });
    }

    // INCREMENT
    const views = article.views ? article.views + 1 : 1;
    const message = await collection.findOneAndUpdate(
      { slug },
      { $set: { views: views } }
    );

    //CLOSE DB AND RESPONSE
    client.close();
    return res.status(200).json({ message });
  } catch (error) {
    client.close();
    return res.status(200).json({ message: (error as Error).message });
  }
}
