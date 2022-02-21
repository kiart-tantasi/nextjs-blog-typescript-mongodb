import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcryptjs from "bcryptjs";

export default function newArticle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const {username, password, firstName, lastName} = req.body;
        if (!username || !password || !firstName || !lastName) throw new Error("missing information");

        res.status(500).json({message:"admin registration is not available now."});
        return;

        const dbUrl = process.env.DB_URL as string;
        const client = new MongoClient(dbUrl);
        const registerAdmin = async() => {
            try {
                await client.connect();
                const db = client.db("blogDB");
                const collection = db.collection("admin");
                
                const findDuplicate = await collection.findOne({username: username});
                if (findDuplicate !== null) throw new Error("username used");

                const hashed = await bcryptjs.hash(password, 10);
                const savingData = {username, password: hashed, firstName, lastName, date: Date.now()};

                await collection.insertOne(savingData);
                client.close();
                res.status(200).json({message:"registered successfully"});
            } catch (error) {
                const err = error as Error;
                res.status(400).json({message: err.message});
            }
        }
        registerAdmin();
    }
}
