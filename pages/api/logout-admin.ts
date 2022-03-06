import { NextApiRequest, NextApiResponse } from "next";
import { removeTokenCookie } from "../../lib/auth-cookie";
import isAuthenticated from "../../lib/jwt-token-validation";

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(400).json({message:"route '/logout-admin' only accepts POST method."});
    }
    removeTokenCookie(res);
    res.status(200).json({message:"logged out successfully"});
});