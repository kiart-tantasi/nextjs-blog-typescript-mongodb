import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import isAuthenticated from "../../lib/jwt-token-validation";
import { transformImgUrl } from "../../lib/transform-data";

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(200).json({message:"only accepts POST method.", imgUrl: "only accepts POST method."});
    }
    const client = new MongoClient(process.env.DB_URL as string);
    const { imgUrl } = req.body;
    if (!imgUrl) return res.status(200).json({imgUrl:"not found"});

    try {
        await client.connect();
        const db = client.db("blogDB");
        const presignedImgUrl = await transformImgUrl(imgUrl, db, false);
        client.close();
        res.status(200).json({imgUrl: presignedImgUrl});

    } catch (error) {
        client.close();
        res.status(200).json({imgUrl: req.body.imgUrl});
    }
});