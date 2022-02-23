import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { tokenValidation } from '../../utilities/token-validation';
import { allowedCategories } from '../../utilities/sharedData';

export default async function newArticle(req: NextApiRequest, res: NextApiResponse) {
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
    if (req.method === "POST") {
        const dbUrl = process.env.DB_URL as string;
        const client = new MongoClient(dbUrl);
        try {
            // CHECK DATA COMPLETENESS
            const { title, desc, markdown, img, alt, date, category, slug } = req.body;
            if (!title || !desc || !markdown || !img || !alt || !date || !category || !slug) throw new Error("some information is missing.");

            // CATEGORY VALIDATION
            if (!allowedCategories.includes(category)) throw new Error("category not allowed");

            // CONNECT DB
            await client.connect();
            const db = client.db("blogDB");

            // CHOSEN CATEGORY
            const collection = db.collection(category);
            const findDuplicateFromCategory = await collection.findOne({slug:slug});
            if (findDuplicateFromCategory !== null) throw new Error("slug is already used.");
            
            // MAIN IF CATEGORY IS NOT WORKSPACE
            const main = db.collection("main");
            if (category !== "workspace") {
                const main = db.collection("main");
                const findDuplicateFromMain = await main.findOne({slug:slug});
                if (findDuplicateFromMain !== null) throw new Error("slug is already used.");
            }

            // INSERT
            const dataToInsert = { title, desc, markdown, img, alt, date, category, slug, views: 1 };
            const categoryInsertResult = await collection.insertOne(dataToInsert);
            let mainCategoryInsertResult = null;
            if (category !== "workspace") mainCategoryInsertResult = await main.insertOne(dataToInsert);
            client.close();

            res.status(200).json({message:categoryInsertResult, message2: mainCategoryInsertResult});
        } catch (error) {
            const err = error as Error;
            if (err.message !== "category not allowed" && err.message !== "some information is missing.") client.close();
            res.status(400).json({message: err.message});
        }
    }
}
