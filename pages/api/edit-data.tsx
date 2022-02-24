import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import isAuthenticated from "../../utils/jwt-token-validation";

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.body;
    if (!slug) {
        res.status(403).json({message:"missing slug or category information"});
        return;
    }
    if (req.method !== "POST") {
        res.status(400).json({message:"invalid method"});
        return;
    }

    // CONNECT DB
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");

    // 1. CHECK IF THE ARTICLE IS IN MAIN OR NOT 2. IF NOT, CHECK AGAIN IF IT IS IN WORKSPACE 3. IF IT IS NOT IN MAIN OR WORKSPACE, RESPONSE 404
    // I DO THIS THIS BECAUSE API CANNOT GET CATEGORY DATA BUT API CAN ONLY GET SLUG THAT IS TYPED IN URL example: 'edit/noCateryDefinedHere'.
    const collection = db.collection("main");
    let articleNoTransformed = await collection.findOne({slug: slug});
    if (articleNoTransformed === null) {
        const workspace = db.collection("workspace");
        articleNoTransformed = await workspace.findOne({slug: slug});
        if (articleNoTransformed === null) {
            res.status(404).json({message:"no article matched to slug found"})
            return;
        }
    }

    //TRANSFORM DATA (IF FOUNT)
    const objectIdAsString = articleNoTransformed!._id.toString();
    const article = {...articleNoTransformed, _id: objectIdAsString};

    // CLOSE DB AND RESPONSE
    client.close();
    res.status(200).json(article);
});