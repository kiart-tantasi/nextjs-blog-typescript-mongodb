import { NextPage } from "next";
import ArticleFormPage from "../../../components/ฺBlog/_ArticleForm"
import NotFoundPage from "../../../components/ฺBlog/NotFoundPage";
import { Article, FormData } from "../../../models/article";

const Edit: NextPage<{article: Article}> = (props) => {
    const article = props.article;

    const handleEditArticle = async(sendingData: FormData) => {
        const response = await fetch("/api/edit-article", {
            method: "PUT",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(sendingData)
        });
        if (response.status === 401) {
            alert("session admin หมดอายุ");
            return false;
        } else if (!response.ok) {
            alert("แก้ไขบทความล้มเหลว !");
            return false;
        } else {
            alert("แก้ไขบทความสำเร็จ - แอปพลิเคชั่นจะใช้เวลาประมาณ 10 วินาทีเพื่อ render หน้าบทความใหม่");
            return true;
        }
    }

    if (article) return <ArticleFormPage handleRequest={handleEditArticle} article={article} />
    return <NotFoundPage />
}

export default Edit;
// -------------------------------------------------------------------------------------------------------- //
import { GetServerSidePropsContext, NextApiResponse } from "next";
import { tokenValidation } from "../../../lib/jwt-token-validation";
import { removeTokenCookie } from "../../../lib/auth-cookie";
import { MongoClient } from "mongodb";

export const getServerSideProps = async(context: GetServerSidePropsContext) => {

    // CHECK TOKEN - IF INVALID, RETURN NULL AND REMOVE TOKEN IN COOKIE
    const token = context.req.cookies.token;
    let result = tokenValidation(token);
    if (result === false) {
        const response = context.res as NextApiResponse;
        removeTokenCookie(response);
        return {props: {}}
    }

    // CONNECT DB
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");

    // 1. CHECK IF THE ARTICLE IS IN MAIN OR NOT 2. IF NOT, CHECK AGAIN IF IT IS IN WORKSPACE 3. IF IT IS NOT IN MAIN OR WORKSPACE, RETURN NULL PROPS
    // I DO THIS THIS BECAUSE THIS HERE CANNOT GET CATEGORY DATA BUT CAN ONLY GET SLUG THAT IS TYPED IN URL example: 'edit/noCateryDefinedHere'.
    const collection = db.collection("main");
    const slug = context.params!.slug;

    let articleNoTransformed = await collection.findOne({slug: slug});
    if (articleNoTransformed === null) {
        const workspace = db.collection("workspace");
        articleNoTransformed = await workspace.findOne({slug: slug});
        if (articleNoTransformed === null) {
            return {props:{}}
        }
    }

    //TRANSFORM DATA (IF FOUND)
    const objectIdAsString = articleNoTransformed!._id.toString();
    const transformedData: Article = {
        _id: objectIdAsString,
        title: articleNoTransformed.title,
        desc: articleNoTransformed.desc,
        markdown: articleNoTransformed.markdown,
        img: articleNoTransformed.img,
        alt: articleNoTransformed.alt,
        date: articleNoTransformed.date,
        category: articleNoTransformed.category,
        slug: articleNoTransformed.slug,
        views: articleNoTransformed.views? articleNoTransformed.views: 1
    };

    // CLOSE DB AND RETURN PROPS
    client.close();
    return {
        props: {
            article: transformedData
        }
    }
}