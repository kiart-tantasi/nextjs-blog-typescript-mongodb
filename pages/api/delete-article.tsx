import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import isAuthenticated from "../../lib/jwt-token-validation";
import { allowedCategories } from "../../utils/sharedData";

export default isAuthenticated(async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {

        // CHECK DATA AND CATEGORY
        const {slug, category} = req.body;
        if ( !slug || !category) {
            res.status(400).json({message:"some information is missing."});
            return;
        }
        if (!allowedCategories.includes(category)) {
            res.status(400).json({message:"wrong category"});
            return; 
        }

        const dbUrl = process.env.DB_URL as string;
        const client= new MongoClient(dbUrl);
        try {
            // CONNECT DB
            await client.connect();
            const db = client.db("blogDB");
            let resultOne = null;
            let resultTwo = null;

            // WORKSPACE OR NOT
            if (category !== "workspace") {
                const collection = db.collection(category);
                const main = db.collection("main");
                resultOne = await collection.findOneAndDelete({slug: slug});
                resultTwo = await main.findOneAndDelete({slug: slug});
            } else {
                const collection = db.collection("workspace");
                resultOne = await collection.findOneAndDelete({slug: slug});
            }

            // MOVE ARTICLE TO BIN COLLECTION
            const bin = db.collection("bin");
            const dataNoTransformed = resultOne.value;
            const insertToBin = {
                title: dataNoTransformed!.title,
                desc: dataNoTransformed!.desc,
                markdown: dataNoTransformed!.markdown,
                img: dataNoTransformed!.img,
                alt: dataNoTransformed!.alt,
                date: dataNoTransformed!.date,
                category: dataNoTransformed!.category,
                slug: dataNoTransformed!.slug,
                views: dataNoTransformed!.views
            }
            await bin.insertOne(insertToBin);

            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message: resultOne, message2: resultTwo});
        } catch (error) {

            // CLOSE DB AND RESPONSE ERR
            client.close();
            const err = error as Error;
            res.status(400).json({message: err.message});
        }
    }
});