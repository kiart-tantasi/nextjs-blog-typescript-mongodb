import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { Article } from '../../models/article';

export default function newArticle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const {category, slug} = req.body;
        const dbUrl = process.env.DB_URL as string;
        const client = new MongoClient(dbUrl);
        const postNewArticle = async() => {
            try {
                await client.connect();
                const db = client.db("blogDB");
                const collection = db.collection(category);
                const mainCategory = db.collection("main");
                const findDuplicateFromMain = await mainCategory.findOne({slug:slug});
                const findDuplicateFromCategory = await collection.findOne({slug:slug});

                if (findDuplicateFromMain !== null || findDuplicateFromCategory !== null) {
                    res.status(400).json({message:"slug is used"});
                    return;
                }

                const categoryResult = await collection.insertOne({...req.body});
                const mainCategoryResult = await mainCategory.insertOne({...req.body});
                client.close();
                res.status(200).json({message:categoryResult, message2: mainCategoryResult});
            } catch (error) {
                const err = error as Error;
                alert(err.message);
            }
        }
        postNewArticle();
    }
}
