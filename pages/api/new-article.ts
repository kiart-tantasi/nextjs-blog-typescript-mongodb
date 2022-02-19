import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

import { dbUrl } from "../../ignoreme";

export default function newArticle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const {category} = req.body;
        const client = new MongoClient(dbUrl);
        const postNewArticle = async() => {
            try {
                await client.connect();
                const db = client.db("blogDB");
                const collection = db.collection(category);
                const mainCategory = db.collection("main")
                const categoryResult = await collection.insertOne({...req.body});
                const mainCategoryResult = await mainCategory.insertOne({...req.body});
                client.close();
                res.status(200).json({message1:categoryResult, message2: mainCategoryResult});
            } catch (error) {
                const err = error as Error;
                alert(err.message);
            }
        }
        postNewArticle();
    }
}
