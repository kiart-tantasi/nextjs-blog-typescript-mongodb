import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

import { EnvGetter } from "../../../lib/env-getter";
import isAuthenticated from "../../../lib/auth-node";
import { handleInvalidMethod } from "../../../api/handleInvalidMethod";
import { COLLECTION } from "./articles";
import { Status } from "../../../interfaces/article";
import { allowedStatusForRecoveringV2, databaseNameV2 } from "../../../config";

export default isAuthenticated(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CHECK METHOD
  if (req.method !== "POST") {
    return handleInvalidMethod(res);
  }

  // VALIDATING BODY
  const { slug } = req.body;
  if (!slug) {
    return res.status(400).json({ message: "some data is missing." });
  }

  const dbUrl = EnvGetter.getDbUrl();
  const client = new MongoClient(dbUrl);
  let connectClient = false;
  try {
    // CONNECT DB
    await client.connect();
    connectClient = true;
    const db = client.db(databaseNameV2);
    const collection = db.collection(COLLECTION.ARTICLES);

    // CHECK IF ARTICLE EXISTS
    const article = await collection.findOne({ slug });
    if (article === null) {
      return res.status(400).json({ message: "article is not found." });
    }

    // CHECK IF ARTICLE IS IN BIN
    if (article.status !== Status.BIN) {
      return res.status(400).json({ message: "article is not in bin." });
    }

    // CHECK IF FIELD "prevStatus" EXISTS AND IS VALID
    const prevStatus = article.prevStatus;
    if (!prevStatus || !allowedStatusForRecoveringV2.includes(prevStatus)) {
      return res
        .status(400)
        .json({ message: "article's prevStatus is not found or is invalid." });
    }

    // UPDATE "status" BASED ON FIELD "prevStatus"
    const updateResult = await collection.updateOne(
      { slug },
      { $set: { status: prevStatus } }
    );

    // RESPOND 200
    return res.status(200).json({ updateResult });
  } catch (error) {
    // RESPOND 500
    console.error((error as Error).message);
    return res.status(500).end();
  } finally {
    // CLOSE DB
    if (connectClient) {
      await client.close();
    }
  }
});
