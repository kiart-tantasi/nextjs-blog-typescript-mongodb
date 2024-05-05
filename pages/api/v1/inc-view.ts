import { MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

import { EnvGetter } from '../../../lib/env-getter'
import { databaseNameV1 } from '../../../config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // ALWAYS RETURN STATUS 200 TO NOT AFFECT USER EXPERIENCE
    const { slug, category } = req.body
    if (!slug || !category) {
        return res.status(200).json({ message: 'no slug or category found' })
    }
    const dbUrl = EnvGetter.getDbUrl()
    const client = new MongoClient(dbUrl)
    try {
        // CONNECT DB
        await client.connect()
        const db = client.db(databaseNameV1)

        // CHOOSE MAIN CATEGORY FOR EVERY CATEGORY EXCEPT WORKSPACE
        const collection = category !== 'workspace' ? db.collection('main') : db.collection('workspace')

        // NO ARTICLE MATCHED TO SLUG FOUND
        const articleNoTransformed = await collection.findOne({ slug: slug })
        if (articleNoTransformed === null) throw new Error('no article matched to slug found')

        // INCREASE VIEW
        let views = articleNoTransformed.views ? articleNoTransformed.views + 1 : 1
        await collection.findOneAndUpdate({ slug: slug }, { $set: { views: views } })

        // ALSO CHANGE VIEWS IN CHOSEN CATEGORY IF NOT WORKSPACE
        if (category !== 'workspace') {
            const specificCollection = db.collection(category)
            await specificCollection.findOneAndUpdate({ slug: slug }, { $set: { views: views } })
        }

        //CLOSE DB AND RESPONSE
        client.close()
        res.status(200).end()
    } catch (error) {
        client.close()
        console.error((error as Error).message)
        res.status(500).end()
    }
}
