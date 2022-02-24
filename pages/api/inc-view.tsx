import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function editData(req: NextApiRequest, res: NextApiResponse) {
    // ALWAYS RETURN STATUS 200 TO NOT AFFECT USER EXPERIENCE
    const { slug, category } = req.body;
    if (!slug || !category) {
        res.status(200).json({message:"no slug or category found"});
        return;
    }

    // CONNECT DB
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");

    // CHOOSE MAIN CATEGORY FOR EVERY CATEGORY EXCEPT WORKSPACE
    const collection = (category !== "workspace")? db.collection("main"): db.collection("workspace");

    // NO ARTICLE MATCHED TO SLUG FOUND
    const articleNoTransformed = await collection.findOne({slug: slug});
    if (articleNoTransformed === null) {
        res.status(200).json({message:"no article matched to slug found"});
        return;
    }

    // INCREASE VIEW
    let views = articleNoTransformed.views? articleNoTransformed.views + 1 : 1;
    const result = await collection.findOneAndUpdate({slug:slug},{$set:{views:views}});

    // ALSO CHANGE VIEWS IN CHOSEN CATEGORY IF NOT WORKSPACE
    let resultTwo = null;
    if (category !== "workspace") {
        const specificCollection = db.collection(category)
        resultTwo = await specificCollection.findOneAndUpdate({slug:slug}, {$set:{views:views}});    
    }

    //CLOSE DB AND RESPONSE
    client.close();
    res.status(200).json({message:result, messageTwo:resultTwo});
}