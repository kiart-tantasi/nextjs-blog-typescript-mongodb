import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import isAuthenticated from '../../lib/jwt-token-validation';
import { FindOneAndUpdateForm } from '../../interfaces/article';

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        try {
            // DATA PREPARATION
            const {category, slug, title, img, alt, desc, markdown} = req.body;
            if (!category || !slug || !title || !img || !alt || !desc || !markdown) throw new Error("some information is missing.");
            const newData: FindOneAndUpdateForm = {
                title: title,
                img: img,
                alt: alt,
                desc: desc,
                markdown: markdown
            }
            const dataToUpdate = {$set:newData};

            // CONNECT DB
            const dbUrl = process.env.DB_URL as string;
            const client = new MongoClient(dbUrl);
            await client.connect();
            const db = client.db("blogDB");
            
            // EDIT IN CHOSEN CATEGORY
            const collection = db.collection(category);
            const replaceCategoryResult = await collection.findOneAndUpdate({slug:slug}, dataToUpdate);
            await collection.updateOne({slug:slug}, {$push:{record:replaceCategoryResult.value}});

            // ALSO EDIT IN MAIN IF CATEGORY IS NOT WORKSPACE
            let replaceMainResult = null;
            const main = db.collection("main");
            if (category !== "workspace") {
                replaceMainResult = await main.findOneAndUpdate({slug:slug}, dataToUpdate);
                await main.updateOne({slug:slug}, {$push:{record:replaceMainResult.value}});
            }
            
            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message:replaceCategoryResult, message2: replaceMainResult});
        } catch (error) {
            const err = error as Error;
            res.status(400).json({message:err.message});
        }
    }
});