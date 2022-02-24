import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import isAuthenticated from "../../utils/jwt-token-validation";

export default isAuthenticated(async function workspaceArticles(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(400).json({message:"invalid method"});
        return;
    }

    // CONNECT DB AND COLLECTION
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("workspace");

    // FIND WORKSPACE ARTICLES
    const articleNoTransformed = await collection.find({}).toArray();

    // TRANSFORM DATA
    const transformedData = articleNoTransformed.map(x => {
      return {...x, _id: x._id.toString()}
    });

    // CLOSE DB AND RESPONSE
    client.close();
    res.status(200).json(transformedData);
});