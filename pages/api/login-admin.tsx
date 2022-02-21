import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export default function newArticle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const {username, password} = req.body;
        if (!username || !password ) throw new Error("missing information");

        const dbUrl = process.env.DB_URL as string;
        const client = new MongoClient(dbUrl);
        const registerAdmin = async() => {
            try {
                await client.connect();
                const db = client.db("blogDB");
                const collection = db.collection("admin");

                const adminUser = await collection.findOne({username:username});
                if (adminUser === null) throw new Error("not found");
                const hashedPassword = adminUser.password;

                const comparing = await bcryptjs.compare(password, hashedPassword);
                if (comparing === false) throw new Error("password incorrect");

                const privateKey = process.env.PRIVATE_KEY as string;

                const token = jwt.sign({
                    date: {username: username},
                    exp: Math.floor(Date.now() / 1000) + 20 // 20s just for testing
                }, privateKey);
                client.close();

                res.status(200).json({message:"registered successfully", token: token});
            } catch (error) {
                const err = error as Error;
                res.status(400).json({message: err.message});
            }
        }
        registerAdmin();
    }
}
