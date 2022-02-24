import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { FindOneAndUpdateForm } from '../../models/article';
import isAuthenticated from '../../utils/jwt-token-validation';

export default isAuthenticated(async function newArticle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        const {category, slug} = req.body;
        if (!category || !slug) {
            res.status(400).json({message:"missing some data"});
            return;
        }
        try {
            const dbUrl = process.env.DB_URL as string;
            const client = new MongoClient(dbUrl);
            await client.connect();
            const db = client.db("blogDB");
            const collection = db.collection(category);
            const mainCategory = db.collection("main");
            const {title, img, alt, desc, markdown, date} = req.body;
            if (!title || !img || !alt || !desc || !markdown || !date) {
                res.status(400).json({message:"some information is missing"});
                return;
            }
            const newData: FindOneAndUpdateForm = {
                title: title,
                img: img,
                alt: alt,
                desc: desc,
                markdown: markdown
            }
            const setDocument = {$set:newData};
            const replaceMainResult = await mainCategory.findOneAndUpdate({slug:slug}, setDocument);
            const replaceCategoryResult = await collection.findOneAndUpdate({slug:slug}, setDocument);
            client.close();

            res.status(200).json({message:replaceCategoryResult, message2: replaceMainResult});
        } catch (error) {
            const err = error as Error;
            res.status(400).json({message:err.message});
        }
    }
});