import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { setTokenCookie } from '../../utils/auth-cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // DECLARE IT HERE BECAUSE IT NEEDS TO BE CLOSED IN CATCH(ERROR) IF AN ERROR IS THROWN
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);

    try {
        if (req.method !== "POST") throw new Error("wrong method");
        
        // DATA PREPARATION
        const {username, password} = req.body;
        if (!username || !password ) throw new Error("some information is missing.");

        // CONNECT DB
        await client.connect();
        const db = client.db("blogDB");
        const collection = db.collection("admin");

        // CHECK IF ACCOUNT EXISTS
        const adminUser = await collection.findOne({username:username});
        if (adminUser === null) throw new Error("user not found");

        // CHECK DATA COMPLETENESS RETURNED FROM DB
        const { username: adminUsername, password: adminHashedPassword, username: adminFirstName, lastName: adminLastName } = adminUser;
        if (!adminUsername || !adminHashedPassword || !adminFirstName || !adminLastName) throw new Error("some data in admin account is missing.");

        // CHECK PASSWORD WITH BCRYPTJS
        const comparing = await bcryptjs.compare(password, adminHashedPassword);
        if (comparing === false) throw new Error("incorrect password");

        // SIGN JWT
        const privateKey = process.env.PRIVATE_KEY as string;
        const token = jwt.sign({
            data: {adminUsername, adminFirstName, adminLastName},
            exp: Math.floor(Date.now() / 1000) + 7200
        }, privateKey);

        // CLOSE DB AND RESPONSE
        client.close();
        setTokenCookie(res, token);
        res.status(200).json({message:"registered successfully", token: token});
    } catch (error) {
        const err = error as Error;
        
        // CLOSE DB BEFORE RESPONSE 400 IN SOME CASES
        if (err.message !== "wrong method" && err.message !== "some information is missing.") client.close();
        res.status(400).json({message: err.message});
    }
}