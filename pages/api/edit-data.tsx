import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import isAuthenticated from "../../utils/jwt-token-validation";

export default isAuthenticated(async function editData(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.body;
    if (!slug) {
        res.status(403).json({message:"no slug found"});
        return;
    }
    if (req.method !== "POST") {
        res.status(400).json({message:"invalid method"});
        return;
    }

    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("main");
    const articleNoTransformed = await collection.findOne({slug: slug});

    if (articleNoTransformed === null) {
        res.status(404).json({message:"no article matched to slug found"})
        return;
    }
    const objectIdAsString = articleNoTransformed!._id.toString();
    const article = {...articleNoTransformed, _id: objectIdAsString};
    client.close();
    res.status(200).json(article);
});