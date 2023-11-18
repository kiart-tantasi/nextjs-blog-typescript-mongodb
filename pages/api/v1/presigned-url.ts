import { MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

import { EnvGetter } from '../../../lib/env-getter'
import isAuthenticated from '../../../lib/auth-node'
import { transformImgUrl } from '../../../lib/transform-data'

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(200).json({ message: 'only accepts POST method.', imgUrl: 'only accepts POST method.' })
    }

    const dbUrl = EnvGetter.getDbUrl()
    const client = new MongoClient(dbUrl)

    const { imgUrl } = req.body
    if (!imgUrl) return res.status(200).json({ imgUrl: 'not found' })

    try {
        await client.connect()
        const db = client.db('blogDB')
        const presignedImgUrl = await transformImgUrl(imgUrl, db, false)
        client.close()
        res.status(200).json({ imgUrl: presignedImgUrl })
    } catch (error) {
        client.close()
        res.status(200).json({ imgUrl: req.body.imgUrl })
    }
})
