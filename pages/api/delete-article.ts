import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import isAuthenticated from "../../lib/jwt-token-validation";
import { allowedCategories } from "../../utils/sharedData";

export default isAuthenticated(async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {

        // CHECK DATA AND CATEGORY
        const {slug, category} = req.body;
        if ( !slug || !category) {
            return res.status(400).json({message:"some information is missing."});
        }
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({message:"wrong category"});
        }

        const dbUrl = process.env.DB_URL as string;
        const client= new MongoClient(dbUrl);
        try {
            // CONNECT DB
            await client.connect();
            const db = client.db("blogDB");
            const collection = db.collection(category);

            // FIND ARTICLE IN SPECIFIC COLLECTION AND SAVE IT TO BIN COLLECTION
            const articleNoTransformed = await collection.findOne({slug: slug});

            if (!articleNoTransformed || !articleNoTransformed.title || !articleNoTransformed.desc || !articleNoTransformed.markdown
                || !articleNoTransformed.img || !articleNoTransformed.alt || !articleNoTransformed.date || !articleNoTransformed.category
                || !articleNoTransformed.slug) throw new Error("article not found in the category or some information is missing.");

            const insertToBin = {
                title: articleNoTransformed.title,
                desc: articleNoTransformed.desc,
                markdown: articleNoTransformed.markdown,
                img: articleNoTransformed.img,
                alt: articleNoTransformed.alt,
                date: articleNoTransformed.date,
                category: articleNoTransformed.category,
                slug: articleNoTransformed.slug,
                views: articleNoTransformed?.views || 1,
                record: articleNoTransformed?.record || []
            }
            const bin = db.collection("bin");
            await bin.insertOne(insertToBin);

            // DELETE IN SPECIFIC CATEGORY
            const resultOne = await collection.findOneAndDelete({slug: slug});

            // IF NOT WORKSPACE, ALSO DELETE IN MAIN
            let resultTwo = null;
            if (category !== "workspace") {
                const main = db.collection("main");
                resultTwo = await main.findOneAndDelete({slug: slug});
            }

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