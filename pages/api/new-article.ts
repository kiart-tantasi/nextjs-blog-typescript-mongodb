import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { allowedCategories } from '../../utils/sharedData';
import isAuthenticated from '../../utils/jwt-token-validation';

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const dbUrl = process.env.DB_URL as string;
        const client = new MongoClient(dbUrl);
        try {
            // DATA PREPARATION
            const { title, desc, markdown, img, alt, date, category, slug } = req.body;
            if (!title || !desc || !markdown || !img || !alt || !date || !category || !slug) throw new Error("some information is missing.");
            if (!allowedCategories.includes(category)) throw new Error("category not allowed");

            // CONNECT DB
            await client.connect();
            const db = client.db("blogDB");

            // CHECK CHOSEN CATEGORY IF SLUG IS USED OR NOT
            const collection = db.collection(category);
            const findDuplicateFromCategory = await collection.findOne({slug:slug});
            if (findDuplicateFromCategory !== null) throw new Error("slug is already used.");
            
            // IF CATEGORY IS NOT WORKSPACE, CHECK MAIN CATEGORY IF SLUG IS USED OR NOT
            const main = db.collection("main");
            if (category !== "workspace") {
                const findDuplicateFromMain = await main.findOne({slug:slug});
                if (findDuplicateFromMain !== null) throw new Error("slug is already used.");
            }

            // INSERT TO CHOSEN CATEGORY AND ALSO MAIN CATEGORY(IF NOT WORKSPACE)
            const dataToInsert = { title, desc, markdown, img, alt, date, category, slug, views: 1 };
            const categoryInsertResult = await collection.insertOne(dataToInsert);
            let mainCategoryInsertResult = null;
            if (category !== "workspace") mainCategoryInsertResult = await main.insertOne(dataToInsert);
            
            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message:categoryInsertResult, message2: mainCategoryInsertResult});
        } catch (error) {
            const err = error as Error;
            
            // CLOSE DB BEFORE RESPONSE 400 IN SOME CASES
            if (err.message !== "some information is missing." && err.message !== "category not allowed") client.close();
            res.status(400).json({message: err.message});
        }
    }
});