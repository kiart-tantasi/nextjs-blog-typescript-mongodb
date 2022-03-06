import jwt from "jsonwebtoken";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getTokenCookie } from "./auth-cookie";

export const tokenValidation = (token: string) => {
    const privateKey = process.env.PRIVATE_KEY as string;
    let valid;
    jwt.verify(token, privateKey, function(err) {
        if (err) {
            valid = false;
        } else {
            valid = true;
        }
    });
    return valid;
}

const isAuthenticated = (fn: NextApiHandler) => async(req: NextApiRequest, res: NextApiResponse) => {
    const token = getTokenCookie(req);

    if (!token) return res.status(400).json({message: "no token found"});
    const valid = tokenValidation(token);
    if (!valid) {
        res.status(401).json({message: "invalid token"});
    } else {
        await fn(req, res);
    }
}
export default isAuthenticated;