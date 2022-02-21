import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import ArticleForm from "../../components/ฺBlog/_ArticleForm"
import { Article, FormData } from "../../models/article";

const Edit:NextPage<{article:Article}> = (props) => {
    const router = useRouter();
    const [ verified, setVerified ] = useState(false);
    const { article } = props;

    useEffect(() => {
        const validateUserToken = async() => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                alert("โปรดเข้าสู่ระบบแอดมิน");
                router.replace("/");
                return;
            }

            const response = await fetch("/api/validate-token", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({token: token})
            });

            if (response.ok) {
                setVerified(true);
            } else {
                alert("session แอดมินหมดอายุ");
                localStorage.removeItem("adminToken");
                router.replace("/");
            }
        }
        validateUserToken();
    }, [])

    const handleEditArticle = async(sendingData: FormData) => {
        
        const response = await fetch("/api/edit-article", {
            method: "PUT",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(sendingData)
        });

        if (response.status === 401) {
            localStorage.removeItem("adminToken");
            alert("session admin หมดอายุ");
            return false;
        } else if (!response.ok) {
            alert("แก้ไขบทความล้มเหลว !");
            return false;
        } else {
            alert("แก้ไขบทความสำเร็จ");
            return true;
        }
    }

    if (verified === true) return <ArticleForm handleRequest={handleEditArticle} article={article} />
    return <div></div>;
}

export default Edit;
// -------------------------------------------------------------------- //
import { MongoClient } from "mongodb";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async(context) => {
    const slug = context.params!.slug;

    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("main");
    const articleNoTransformed = await collection.findOne({slug: slug});
    if (articleNoTransformed === null) return {props:{article:null}};
    const objectIdAsString = articleNoTransformed!._id.toString();
    const article = {...articleNoTransformed, _id: objectIdAsString};
    client.close();

    return {
        props: { article }
    }
}