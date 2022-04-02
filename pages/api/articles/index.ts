import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import slugify from 'slugify';
import isAuthenticated from '../../../lib/jwt-token-validation';
import { setDataForm, FindOldVersionForm } from '../../../interfaces/article';

export default isAuthenticated(async function handler(req: NextApiRequest, res: NextApiResponse) {
    // DB CONFIG
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    let connectClient = false;
    
    // POST A NEW ARTICLE
    if (req.method === "POST") {

        try {
            // CHECK REQUEST DATA
            const { title, desc, markdown, img, alt } = req.body;
            if (!title || !desc || !markdown || !img || !alt) throw new Error("some information is missing.");

            // CONNECT DB
            await client.connect();
            connectClient = true;
            const db = client.db("blogDB");

            // PREPARE DATA
            const temporarySlug = slugify("workspace" + new Date().getTime().toString() + "randomNum:" + Math.floor(Math.random() * 1000));
            const dataToInsert = { 
                title,
                desc, 
                markdown,
                img,
                alt,
                date: Date.now(),
                category: "workspace",
                slug: temporarySlug,
                views: 1,
                record: []
            };

            // INSERT INTO WORKSPACE CATEGORY
            const workspace = db.collection("workspace");
            const insertResult = await workspace.insertOne(dataToInsert);
            
            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message:insertResult});
        } catch (error) {            
            // CLOSE DB BEFORE RESPONSE 400 IN SOME CASES
            if (connectClient) client.close();
            const err = error as Error;
            res.status(400).json({message: err.message});
        }
    }

    // UPDATE AN ARTICLE
    else if (req.method === "PUT") {

        try {
            // CHECK REQUEST DATA
            const {category, slug, title, img, alt, desc, markdown} = req.body;
            if (!category || !slug || !title || !img || !alt || !desc || !markdown) throw new Error("some information is missing.");

            // CONNECT DB
            await client.connect();
            connectClient = true;
            const db = client.db("blogDB");

            // FIND EXISTING ARTICLE
            const collection = db.collection(category);
            const oldVersion = await collection.findOne({slug:slug});
            if (oldVersion === null) throw new Error("article not found.");

            // TRANSFORM OLD VERSION AND PUSH TO RECORD
            const transformedOldVersion: FindOldVersionForm = {
                id: oldVersion._id.toString(),
                title: oldVersion.title,
                desc: oldVersion.desc,
                markdown: oldVersion.markdown,
                img: oldVersion.img,
                alt: oldVersion.alt,
                date: oldVersion.date,
                category: oldVersion.category,
                slug: oldVersion.slug,
                views: oldVersion?.views || 1,
                editDate: Date.now()
            }
            const record = oldVersion.record || [];
            record.push(transformedOldVersion);

            // PREPARE DATA TO UPDATE ($set)
            const newData: setDataForm = {
                title: title,
                img: img,
                alt: alt,
                desc: desc,
                markdown: markdown,
                record: record,
            }
            const setUpdatedData = {$set: newData};
            
            // UPDATE IN SPECIFIC CATEGORY
            const updateSpecificCategoryResult = await collection.updateOne({slug:slug}, setUpdatedData);
            
            // IF NOT WORKSPACE, ALSO UPDATE IN MAIN  (AND ALSO PUSH OLD VERSION IN TO RECORD KEY IN MAIN CATEGORY)
            let updateMainCategoryResult = null;
            if (category !== "workspace") {
                const main = db.collection("main");
                updateMainCategoryResult = await main.updateOne({slug:slug}, setUpdatedData);
            }
            
            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message: updateSpecificCategoryResult, message2: updateMainCategoryResult});
        } catch (error) {
            if (connectClient) client.close();
            const err = error as Error;
            res.status(400).json({message:err.message});
        }
    }

    // DELETE METHODS
    else if (req.method === "DELETE" && req.body.permanentDelete === null) {
        return res.status(500).json({message:"please decribe deleting type (permanent: true/false)"});
    }

    // DELETE AN ARTICLE (MOVE TO BIN)
    else if (req.method === "DELETE" && req.body.permanentDelete === false) {
        
        try {
            // CHECK REQUEST DATA
            const {slug, category} = req.body;
            if (!slug || !category) throw("some information is missing.");

            // CONNECT DB
            await client.connect();
            connectClient = true;
            const db = client.db("blogDB");
            const collection = db.collection(category);

            // FIND ARTICLE IN SPECIFIC COLLECTION
            const articleNoTransformed = await collection.findOne({slug: slug});
            if (!articleNoTransformed || !articleNoTransformed.title || !articleNoTransformed.desc || !articleNoTransformed.markdown
                || !articleNoTransformed.img || !articleNoTransformed.alt || !articleNoTransformed.date || !articleNoTransformed.category
                || !articleNoTransformed.slug) throw new Error("article not found in the category or some information is missing.");

            // PREPARE DATA TO INSERT INTO BIN
            const dataToInsertToBin = {
                title: articleNoTransformed.title,
                desc: articleNoTransformed.desc,
                markdown: articleNoTransformed.markdown,
                img: articleNoTransformed.img,
                alt: articleNoTransformed.alt,
                date: articleNoTransformed.date,
                category: articleNoTransformed.category,
                slug: articleNoTransformed.slug,
                views: articleNoTransformed?.views || 1,
                record: articleNoTransformed?.record || []
            }

            // INSERT INTO BIN
            const bin = db.collection("bin");
            await bin.insertOne(dataToInsertToBin);

            // DELETE IN SPECIFIC CATEGORY
            const specificCategoryDeleteResult = await collection.deleteOne({slug: slug});

            // IF NOT WORKSPACE, ALSO DELETE IN MAIN CATEGORY
            let mainCategoryDeleteResult = null;
            if (category !== "workspace") {
                const main = db.collection("main");
                mainCategoryDeleteResult = await main.deleteOne({slug: slug});
            }

            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message: specificCategoryDeleteResult, message2: mainCategoryDeleteResult});
        } catch (error) {
            // CLOSE DB AND RESPONSE ERROR
            if (connectClient) client.close();
            const err = error as Error;
            res.status(400).json({message: err.message});
        }
    }

    // DELETE ARTICLE (PERMANENTLY)
    else if (req.method === "DELETE" && req.body.permanentDelete === true) {
            
        try {
            // CHECK REQUEST DATA
            const {slug} = req.body;
            if (!slug ) throw new Error("slug is missing.");

            // CONNECT DB
            await client.connect();
            connectClient = true;
            const db = client.db("blogDB");
            const bin = db.collection("bin");

            // DELETE FROM BIN COLLECTION
            const permanentDeleteResult = await bin.deleteOne({slug: slug});

            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json({message: permanentDeleteResult});
        } catch (error) {
            // CLOSE DB AND RESPONSE ERROR
            if (connectClient) client.close();
            const err = error as Error;
            res.status(400).json({message: err.message});
        }
    }

    // NO MATCHING METHOD
    else {
        res.status(404).json({message:"no matching method."});
    }
});