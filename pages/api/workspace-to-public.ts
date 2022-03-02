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
            const { category, slug, workspaceSlug } = req.body;
            if (!category || !slug || !workspaceSlug) throw new Error("some information is missing.");
            if (!allowedCategories.includes(category) || category === "workspace") throw new Error("category not allowed");

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

            // FIND FROM WORKSPACE
            const workspace = db.collection("workspace");
            const articleFromWorkspace = await workspace.findOne({slug: workspaceSlug});

            // PREPARE DATA
            const dataToInsert = {
                title: articleFromWorkspace!.title,
                desc: articleFromWorkspace!.desc, 
                markdown: articleFromWorkspace!.markdown, 
                img: articleFromWorkspace!.img,
                alt: articleFromWorkspace!.alt,
                date: Date.now(),
                category: category,
                slug: slug,
                views: 1,
                record: articleFromWorkspace?.record || []
            }

            // INSERT TO CHOSEN CATEGORY AND MAIN CATEGORY
            const categoryInsertResult = await collection.insertOne(dataToInsert);
            const mainCategoryInsertResult = await main.insertOne(dataToInsert);

            // DELETE IN WORKSPACE
            await workspace.deleteOne({slug: workspaceSlug});

            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message:categoryInsertResult, message2: mainCategoryInsertResult});
        } catch (error) {
            // CLOSE DB BEFORE RESPONSE 400 IN SOME CASES
            if (connectClient) client.close();
            const err = error as Error;
            res.status(400).json({message: err.message});
        }
    }
});