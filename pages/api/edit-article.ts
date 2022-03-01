import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import isAuthenticated from '../../lib/jwt-token-validation';
import { FindOneAndUpdateForm } from '../../interfaces/article';

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        const dbUrl = process.env.DB_URL as string;
        const client = new MongoClient(dbUrl);
        let connectClient = false;

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
            await client.connect();
            connectClient = true;
            const db = client.db("blogDB");
            
            // EDIT IN SPECIFIC CATEGORY
            const collection = db.collection(category);
            const replaceCategoryResult = await collection.findOneAndUpdate({slug:slug}, dataToUpdate);

            // PUSH OLD VERSION IN TO RECORD KEY IN SPECIFIC CATEGORY (DELETE RECORD KEY FIRST TO SAVE SPACE IN DATABASE)
            const dataToPushToRecord = replaceCategoryResult.value;
            delete dataToPushToRecord?.record;
            await collection.updateOne({slug:slug}, {$push:{record: dataToPushToRecord}});

            // IF NOT WORKSPACE, ALSO EDIT IN MAIN  (AND ALSO PUSH OLD VERSION IN TO RECORD KEY IN MAIN CATEGORY)
            let replaceMainResult = null;
            const main = db.collection("main");
            if (category !== "workspace") {
                replaceMainResult = await main.findOneAndUpdate({slug:slug}, dataToUpdate);
                await main.updateOne({slug:slug}, {$push:{record: dataToPushToRecord}}); // you can comment this if you only want to keep edit record in specific category
            }
            
            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message:replaceCategoryResult, message2: replaceMainResult});
        } catch (error) {
            if (connectClient) client.close();
            const err = error as Error;
            res.status(400).json({message:err.message});
        }
    }
});