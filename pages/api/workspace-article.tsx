import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import isAuthenticated from "../../utils/jwt-token-validation";

export default isAuthenticated(async function workspaceArticles(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(400).json({message:"invalid method"});
        return;
    }
    const { slug } = req.body;
    if (!slug) {
        res.status(400).json({message:"no slug found"});
        return;
    }

    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("workspace");
    const articleNoTransformed = await collection.findOne({slug: slug});
    client.close();
    if (articleNoTransformed === null) {
        res.status(404).json({message:"no article matched to slug found"});
    } else {
        const transformedData = {...articleNoTransformed, _id: articleNoTransformed!._id.toString()};
        client.close();
        res.status(200).json(transformedData);
    }
});