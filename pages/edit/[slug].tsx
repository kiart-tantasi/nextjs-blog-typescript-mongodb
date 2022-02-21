import { GetServerSideProps, NextPage } from "next";
import ArticleForm from "../../components/ฺBlog/_ArticleForm"
import { Article } from "../../models/article";

const Edit:NextPage<{article:Article}> = (props) => {
    const { article } = props;

    const handleEditArticle = async(article: Article) => {
        
        const response = await fetch("/api/edit-article", {
            method: "PUT",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(article)
        });

        if (response.status === 401) {
            const json = await response.json();
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

    return <ArticleForm handleRequest={handleEditArticle} article={article} />
}

export default Edit;
// -------------------------------------------------------------------- //
import { MongoClient } from "mongodb";

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