import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import jwt from "jsonwebtoken";

export default function newArticle(req: NextApiRequest, res: NextApiResponse) {
    // ----------------------------------------------------------- //
    const { token } = req.body;
    if (!token) {
        res.status(400).json({message:"no token found"});
        return;
    } else {
        const privateKey = process.env.PRIVATE_KEY as string;
        let returnNow = false;
        
        jwt.verify(token, privateKey, function(err: any) {
            if (err) {
                res.status(401).json({message:"invalid token"});
                returnNow = true;
            }
        });
        if (returnNow) return;
    }
    // ----------------------------------------------------------- //
    if (req.method === "PUT") {
        const {category, slug} = req.body;
        if (!category || !slug) {
            res.status(400).json({message:"missing some data"});
            return;
        }

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
