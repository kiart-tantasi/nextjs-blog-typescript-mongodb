import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from "jsonwebtoken";

export default function newArticle(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body;
    const { token } = body;

    if (!token) {
        res.status(400).json({message:"no token found"});
        return;
    } else {
        const privateKey = process.env.PRIVATE_KEY as string;
        jwt.verify(token, privateKey, function(err: any) {
            if (err) {
                res.status(400).json({message:"invalid token"});
            } else {
                res.status(200).json({message:"token verified successfully"});
            }
        });
    }
}
