import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { tokenValidation } from '../../utilities/token-validation';

export default async function newArticle(req: NextApiRequest, res: NextApiResponse) {
    // ----------------------------------------------------------- //
    const { token } = req.body;
    if (!token) {
        res.status(400).json({message:"no token found"});
        return;
    } 
    const valid = tokenValidation(token);
    if (!valid) {
        res.status(401).json({message:"invalid token"});
        return;
    }
    // ----------------------------------------------------------- //
    if (req.method === "POST") {
        const {category, slug} = req.body;
        const dbUrl = process.env.DB_URL as string;
        const client = new MongoClient(dbUrl);
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
            res.status(400).json({message:err.message});
        }
    }
}
