import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getTokenCookie, removeTokenCookie } from "../../lib/auth-cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = getTokenCookie(req);
    
    if (!token) {
        res.status(400).json({message:"no token found"});
    } else {
        const privateKey = process.env.PRIVATE_KEY as string;
        jwt.verify(token, privateKey, function(err: any) {
            if (err) {
                removeTokenCookie(res);
                res.status(401).json({message:"invalid token"});
            } else {
                res.status(200).json({message:"token verified successfully"});
            }
        });
    }
}