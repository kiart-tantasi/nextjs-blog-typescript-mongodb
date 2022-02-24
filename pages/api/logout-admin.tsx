import { NextApiRequest, NextApiResponse } from "next";
import { removeTokenCookie } from "../../utils/auth-cookie";
import isAuthenticated from "../../utils/jwt-token-validation";

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.status(400).json({message:"wrong method"});
        return;
    }
    removeTokenCookie(res);
    res.status(200).json({message:"logged out successfully"});
});