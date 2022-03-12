import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import isAuthenticated from "../../lib/jwt-token-validation";

export default isAuthenticated(async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {

        // CHECK DATA AND CATEGORY
        const {slug, category} = req.body;
        if ( !slug || !category) {
            return res.status(400).json({message:"some information is missing."});
        }

        const dbUrl = process.env.DB_URL as string;
        const client= new MongoClient(dbUrl);
        try {
            // CONNECT DB
            await client.connect();
            const db = client.db("blogDB");
            const binCollection = db.collection("bin");

            // FIND THE ARTICLE FROM BIN BY CATEGORY AND SLUG
            const deletedArticle = await binCollection.findOne({slug: slug});
            if (!deletedArticle) throw new Error("The article cannot be found in bin collection.");

            // 1. IF NOT WORKSPACE
            if (category !== "workspace") {

                const main = db.collection("main");
                const specificCategory = db.collection(category);

                const mainResult = await main.insertOne(deletedArticle);
                const specificCategoryResult = await specificCategory.insertOne(deletedArticle);

                client.close();
                res.status(200).json({message:"recovered to main and specific category successfully.", mainResult, specificCategoryResult});
            }

            // 2. WORKSPACE CATEGORY
            else {
                const workspace = db.collection("workspace");
                const workspaceResult = await workspace.insertOne(deletedArticle);
                
                client.close();
                res.status(200).json({message: "recovered to workspace successfully", workspaceResult});
            }

        } catch (error) {

            // CLOSE DB AND RESPONSE ERR
            client.close();
            const err = error as Error;
            res.status(400).json({message: err.message});
        }
    }
});