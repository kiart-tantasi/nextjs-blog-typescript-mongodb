import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import isAuthenticated from "../../lib/jwt-token-validation";

export default isAuthenticated(async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {

        // CHECK DATA AND CATEGORY
        const { slug } = req.body;
        if (!slug) return res.status(400).json({message:"slug is missing."});

        const dbUrl = process.env.DB_URL as string;
        const client= new MongoClient(dbUrl);
        try {
            // CONNECT DB
            await client.connect();
            const db = client.db("blogDB");
            const bin = db.collection("bin");

            // DELETE FROM BIN COLLECTION
            const result = await bin.deleteOne({slug: slug});

            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message: result});
        } catch (error) {

            // CLOSE DB AND RESPONSE ERR
            client.close();
            const err = error as Error;
            res.status(400).json({message: err.message});
        }
    }
});