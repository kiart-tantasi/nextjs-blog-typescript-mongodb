import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function editData(req: NextApiRequest, res: NextApiResponse) {
    // only return status 200
    const { slug, category } = req.body;
    if (!slug || !category) {
        res.status(200).json({message:"no slug or category found"});
        return;
    }

    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("main");
    const articleNoTransformed = await collection.findOne({slug: slug});
    if (articleNoTransformed === null) {
        res.status(200).json({message:"no article matched to slug found"});
        return;
    }
    let views = articleNoTransformed.views? articleNoTransformed.views + 1 : 1;
    const result = await collection.findOneAndUpdate({slug:slug},{$set:{views:views}});
    const specificCollection = db.collection(category)
    const resultTwo = await specificCollection.findOneAndUpdate({slug:slug}, {$set:{views:views}});
    client.close();

    res.status(200).json({message:result, messageTwo:resultTwo});
}