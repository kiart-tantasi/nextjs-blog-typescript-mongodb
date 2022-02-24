import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcryptjs from "bcryptjs";
import isAuthenticated from '../../utils/jwt-token-validation';

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        res.status(500).json({message:"admin registration is not available now."});
        return;

        const dbUrl = process.env.DB_URL as string;
        const client = new MongoClient(dbUrl);
        try {
            // DATA PREPARATION
            const {username, password, firstName, lastName} = req.body;
            if (!username || !password || !firstName || !lastName) throw new Error("missing information");

            // CONNECT DB AND COLLECTION ADMIN
            await client.connect();
            const db = client.db("blogDB");
            const collection = db.collection("admin");

            // CHECK IF USERNAME IS ALREADY USED OR NOT
            const findDuplicate = await collection.findOne({username: username});
            if (findDuplicate !== null) throw new Error("username used");

            // HASHING PASSWORD
            const hashed = await bcryptjs.hash(password, 10);
            const savingData = {username, password: hashed, firstName, lastName, date: Date.now()};
            await collection.insertOne(savingData);

            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message:"registered successfully"});
        } catch (error) {
            const err = error as Error;

            // CLOSE DB IN SOME CASES
            if (err.message !== "missing information") client.close();
            res.status(400).json({message: err.message});
        }
    }
});
