import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default function newArticle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const client = new MongoClient("mongodb://localhost:27017");
        const postNewArticle = async() => {
            try {
                await client.connect();
                const db = client.db("blogDB");
                const collection = db.collection("articles");
                const result = await collection.insertOne({...req.body, date: Date.now()});
                client.close();
                res.status(200).json({message:result});
            } catch (error) {
                const err = error as Error;
                alert(err.message);
            }
        }
        postNewArticle();
    }
}
