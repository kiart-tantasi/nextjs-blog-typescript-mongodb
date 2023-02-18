import type { NextApiRequest, NextApiResponse } from 'next'

// import { MongoClient } from 'mongodb';
// import bcryptjs from "bcryptjs";
import isAuthenticated from '../../lib/auth-node'

// import { EnvGetter } from '../../lib/get-env';

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        return res.status(500).json({ message: 'admin registration is not available now.' })

        // const dbUrl = EnvGetter.getDbUrl();
        // const client = new MongoClient(dbUrl);
        // let connectClient = false;
        // try {
        //     // DATA PREPARATION
        //     const {username, password, firstName, lastName} = req.body;
        //     if (!username || !password || !firstName || !lastName) throw new Error("missing information");

        //     // CONNECT DB AND COLLECTION ADMIN
        //     await client.connect();
        //     connectClient = true;
        //     const db = client.db("blogDB");
        //     const collection = db.collection("admin");

        //     // CHECK IF USERNAME IS ALREADY USED OR NOT
        //     const findDuplicate = await collection.findOne({username: username});
        //     if (findDuplicate !== null) throw new Error("username used");

        //     // HASHING PASSWORD
        //     const hashed = await bcryptjs.hash(password, 10);
        //     const savingData = {username, password: hashed, firstName, lastName, date: Date.now()};
        //     await collection.insertOne(savingData);

        //     // CLOSE DB AND RESPONSE
        //     client.close();
        //     res.status(200).json({message:"registered successfully"});
        // } catch (error) {
        //     // CLOSE DB IN SOME CASES
        //     if (connectClient) client.close();
        //     const err = error as Error;
        //     res.status(400).json({message: err.message});
        // }
    }
})
