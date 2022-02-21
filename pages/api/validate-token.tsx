import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default function newArticle(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.body;

    if (!token) {
        res.status(404).json({message:"no token found"});
    } else {
        const privateKey = process.env.PRIVATE_KEY as string;
        
        jwt.verify(token, privateKey, function(err: any) {
            if (err) {
                res.status(401).json({message:"invalid token"});
            } else {
                res.status(200).json({message:"token verified successfully"});
            }
        });
    }
    return;
}