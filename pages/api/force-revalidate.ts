import { NextApiRequest, NextApiResponse } from "next"

// ref: https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#using-on-demand-revalidation
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await res.revalidate('/path-to-revalidate')
        return res.status(200).send('Revalidated')
    } catch (err) {
        return res.status(500).send('Error revalidating')
    }
}
