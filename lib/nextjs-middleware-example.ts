import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

// MIDDLEWARE
const isAuthenticated = (api: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => {
    // check whether request is authenticated or not
    const { user } = req.cookies

    // if not authenticated, response with 4xx
    if (!user) res.status(403).json({ message: 'no permission' })
    // if authenticated, just pass the request into API
    else api(req, res)
}

// // API
// export default isAuthenticated(async function api(req: NextApiRequest, res: NextApiResponse) {
//     res.status(200).json({message: "user found !"});
// });
