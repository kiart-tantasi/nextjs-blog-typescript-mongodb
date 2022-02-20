import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default function newArticle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        const {category, slug} = req.body;
        console.log("REQ.BODY:", req.body);

        const editArticle = async() => {
            try {
                const dbUrl = process.env.DB_URL as string;
                const client = new MongoClient(dbUrl);
                await client.connect();
                const db = client.db("blogDB");
                const collection = db.collection(category);
                const mainCategory = db.collection("main");
                const replaceMainResult = await mainCategory.findOneAndReplace({slug:slug}, req.body);
                const replaceCategoryResult = await collection.findOneAndReplace({slug:slug}, req.body);
                client.close();

                res.status(200).json({message:replaceCategoryResult, message2: replaceMainResult});
            } catch (error) {
                const err = error as Error;
                res.status(400).json({message:err.message});
            }
        }
        editArticle();
    }
}
