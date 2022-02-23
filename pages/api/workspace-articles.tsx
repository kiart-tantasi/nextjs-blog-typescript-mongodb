import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { tokenValidation } from "../../utilities/token-validation";

export default async function workspaceArticles(req: NextApiRequest, res: NextApiResponse) {
    // ----------------------------------------------------------- //
    const { token } = req.body;
    if (!token) {
        res.status(400).json({message:"no token found"});
        return;
    } 
    const valid = tokenValidation(token);
    if (!valid) {
        res.status(401).json({message:"invalid token"});
        return;
    }
    // ----------------------------------------------------------- //
    if (req.method !== "POST") {
        res.status(400).json({message:"invalid method"});
        return;
    }
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("workspace");
    const articleNoTransformed = await collection.find({}).toArray();
    const transformedData = articleNoTransformed.map(x => {
      return {...x, _id: x._id.toString()}
    });
    client.close();
    res.status(200).json(transformedData);
}