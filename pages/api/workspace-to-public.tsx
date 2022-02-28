import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { allowedCategories } from '../../utils/sharedData';
import isAuthenticated from '../../lib/jwt-token-validation';

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const dbUrl = process.env.DB_URL as string;
        const client = new MongoClient(dbUrl);
        let connectClient = false;
        try {
            // DATA PREPARATION
            const { title, desc, markdown, img, alt, category, slug, workspaceSlug } = req.body;
            if (!title || !desc || !markdown || !img || !alt || !category || !slug || !workspaceSlug) throw new Error("some information is missing.");
            if (!allowedCategories.includes(category)) throw new Error("category not allowed");
            if (category === "workspace") throw new Error("cannot post from workspace to workspace");

            // CONNECT DB
            await client.connect();
            connectClient = true;
            const db = client.db("blogDB");

            // CHECKIF SLUG IS ALREADY USED OR NOT IN CHOSEN CATEGORY AND MAIN CATEGORY 
            const collection = db.collection(category);
            const main = db.collection("main");
            const findDuplicateFromCategory = await collection.findOne({slug:slug});
            const findDuplicateFromMainCategory = await main.findOne({slug:slug});
            if (findDuplicateFromCategory !== null || findDuplicateFromMainCategory !== null) throw new Error("slug is already used.");            

            // INSERT TO CHOSEN CATEGORY AND MAIN CATEGORY
            const dataToInsert = { title, desc, markdown, img, alt, date: Date.now(), category, slug, views: 1 };
            const categoryInsertResult = await collection.insertOne(dataToInsert);
            const mainCategoryInsertResult = await main.insertOne(dataToInsert);

            // DELETE FROM WORKSPACE
            const workspace = db.collection("workspace");
            await workspace.findOneAndDelete({slug: workspaceSlug});
            
            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message:categoryInsertResult, message2: mainCategoryInsertResult});
        } catch (error) {
            const err = error as Error;
            
            // CLOSE DB BEFORE RESPONSE 400 IN SOME CASES
            if (connectClient) client.close();
            res.status(400).json({message: err.message});
        }
    }
});