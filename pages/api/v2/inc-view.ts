import { NextApiRequest, NextApiResponse } from "next";

import { COLLECTION, getDbName, getMongoClient } from "./articles";
import { allowedCategories } from "../../../utils/sharedData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // BAD CASES (ALWAYS RETURN STATUS 200 FOR GOOD UX)
  const { slug, category } = req.body;
  if (!slug || !category) {
    return res.status(200).json({ message: "no slug or category found" });
  }
  if (!allowedCategories.includes(category) || category === "workspace") {
    return res.status(200).json({
      message: "category is not allowed for view-incrementing",
    });
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

    // IF FOUND, INCREMENT VIEWS
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
