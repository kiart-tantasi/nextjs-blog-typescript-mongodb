import { MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

import { EnvGetter } from '../../../lib/env-getter'
import isAuthenticated from '../../../lib/auth-node'
import { databaseNameV1 } from '../../../config'

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // CHECK DATA AND CATEGORY
        const { slug, category } = req.body
        if (!slug || !category) {
            return res.status(400).json({ message: 'some information is missing.' })
        }

        const dbUrl = EnvGetter.getDbUrl()
        const client = new MongoClient(dbUrl)
        try {
            // CONNECT DB
            await client.connect()
            const db = client.db(databaseNameV1)
            const binCollection = db.collection('bin')

            // FIND THE ARTICLE FROM BIN BY CATEGORY AND SLUG
            const deletedArticle = await binCollection.findOne({ slug: slug })
            if (!deletedArticle) throw new Error('The article cannot be found in bin collection.')

            // 1. IF NOT WORKSPACE
            if (category !== 'workspace') {
                // INSERT
                const main = db.collection('main')
                const specificCategory = db.collection(category)
                const mainCategoryInsertResult = await main.insertOne(deletedArticle)
                const specificCategoryInsertResult = await specificCategory.insertOne(deletedArticle)

                // DELETE FROM BIN
                const deleteResult = await binCollection.deleteOne({ slug: slug })

                // CLOSE DB AND RESPONSE
                client.close()
                res.status(200).json({
                    message: 'recovered to main and specific category successfully.',
                    message2: mainCategoryInsertResult,
                    message3: specificCategoryInsertResult,
                    message4: deleteResult,
                })
            }

            // 2. WORKSPACE CATEGORY
            else {
                // INSERT
                const workspace = db.collection('workspace')
                const workspaceCategoryInsertResult = await workspace.insertOne(deletedArticle)

                // DELETE FROM BIN
                const deleteResult = await binCollection.deleteOne({ slug: slug })

                // CLOSE DB AND RESPONSE
                client.close()
                res.status(200).json({
                    message: 'recovered to workspace successfully',
                    message2: workspaceCategoryInsertResult,
                    message3: deleteResult,
                })
            }
        } catch (error) {
            // CLOSE DB AND RESPONSE ERR
            client.close()
            const err = error as Error
            res.status(400).json({ message: err.message })
        }
    }
})
