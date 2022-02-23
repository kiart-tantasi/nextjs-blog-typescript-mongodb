import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function newArticle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const {username, password} = req.body;
        if (!username || !password ) throw new Error("missing information");
        const dbUrl = process.env.DB_URL as string;
        const client = new MongoClient(dbUrl);
        try {
            await client.connect();
            const db = client.db("blogDB");
            const collection = db.collection("admin");
            const adminUser = await collection.findOne({username:username});
            if (adminUser === null) throw new Error("user not found");
            const { username: adminUsername, password: adminHashedPassword, username: adminFirstName, lastName: adminLastName } = adminUser;
            if (!adminUsername || !adminHashedPassword || !adminFirstName || !adminLastName) throw new Error("some data in admin account is missing.");
            const comparing = await bcryptjs.compare(password, adminHashedPassword);
            if (comparing === false) throw new Error("incorrect password");
            const privateKey = process.env.PRIVATE_KEY as string;
            const token = jwt.sign({
                data: {adminUsername, adminFirstName, adminLastName},
                exp: Math.floor(Date.now() / 1000) + 1200
            }, privateKey);
            client.close();
            res.status(200).json({message:"registered successfully", token: token});
        } catch (error) {
            const err = error as Error;
            res.status(400).json({message: err.message});
        }
    } else {
        res.status(400).json({message:"wrong method"});
    }
}