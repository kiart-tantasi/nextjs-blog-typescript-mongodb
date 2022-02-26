import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getTokenCookie, removeTokenCookie } from "../../lib/auth-cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // ALWAYS RETURN STATUS 200 TO NOT AFFECT USER EXPERIENCE
    const token = getTokenCookie(req);
    if (!token) {
        res.status(200).json({isLoggedIn: false});
    } else {
        const privateKey = process.env.PRIVATE_KEY as string;
        jwt.verify(token, privateKey, function(err: any, decoded) {
            if (err) {
                removeTokenCookie(res);
                res.status(200).json({isLoggedIn: false});
            } else {
                res.status(200).json({isLoggedIn: true});
            }
        });
    }
}