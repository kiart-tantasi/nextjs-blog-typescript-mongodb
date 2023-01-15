import { MongoClient } from "mongodb";
import {  NextApiRequest, NextApiResponse } from "next";
import { Lexer, Parser } from "marked";
import { EnvGetter } from "../../../lib/env-getter";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    if (req.method === "GET") {

        const dbUrl = EnvGetter.getDbUrl();
        const client = new MongoClient(dbUrl);
        let connectClient = false;

        try {
            // CHECK QUERY
            const { slug } = req.query;
            if (!slug) throw new Error("Not found");

            // CONNECT DB
            await client.connect();
            connectClient = true;

            // FIND ARTICLE IN MAIN CATEGORY
            const db = client.db("blogDB");
            const main = db.collection("main");
            const article = await main.findOne({slug:slug});
            if (article === null) throw new Error("Not found");

            // TRANSFORM MARKDOWN TO HTML
            const markdown = article.markdown;
            const lexedMarkdown = Lexer.lex(markdown);
            const parsedMarkdown = Parser.parse(lexedMarkdown);

            // TRANSFORM DATA BEFORE SENDING
            const transformedArticle = {
                title: article.title,
                desc: article.desc,
                markdown: parsedMarkdown,
                img: article.img,
                alt: article.alt,
                date: article.date,
                category: article.category,
                slug: article.slug
            }

            // CLOSE DB AND RESPONSE
            client.close();
            res.status(200).json(transformedArticle);
        } catch (error) {
            // CLOSE DB AND RESPONSE ERROR
            if (connectClient) client.close();
            const err = error as Error;
            res.status(500).json({message: err.message});
        }
    }
}