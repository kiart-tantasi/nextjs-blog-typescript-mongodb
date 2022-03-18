import { NextPage } from "next";
import Form from "../../../components/Form/Form";
import NotFoundPage from "../../../components/blog/NotFoundPage";
import { Article } from "../../../interfaces/article";

const Edit: NextPage<{article: Article}> = (props) => {
    const article = props.article;
    if (article) return <Form article={article} editMode={true} />
    return <NotFoundPage />
}

export default Edit;
// -------------------------------------------------------------------------------------------------------- //
import { GetServerSidePropsContext } from "next";
import { MongoClient } from "mongodb";

export const getServerSideProps = async(context: GetServerSidePropsContext) => {
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