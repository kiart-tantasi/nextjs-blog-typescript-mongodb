import ArticleForm from "../../components/ฺBlog/_ArticleForm";
import NotFoundPage from "../../components/ฺBlog/NotFoundPage";
import React from "react";
import { FormData } from "../../models/article";
import { NextApiResponse, NextPage } from "next";

const NewArticle: NextPage<{isLoggedIn: boolean}> = (props) => {
    const handleAddNewArticle = async(sendingData: FormData) => {
        const response = await fetch("/api/new-article", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(sendingData)
        });
        if (response.status === 401) {
            alert("session แอดมินหมดอายุ");
            return false;
        } else if (!response.ok) {
            alert("เพิ่มบทความล้มเหลว !");
            return false;
        } else {
            alert("เพิ่มบทความสำเร็จ");
            return true;
        }
    }
    if (props.isLoggedIn === true) return <ArticleForm handleRequest={handleAddNewArticle} />;
    return <NotFoundPage />
}
export default NewArticle;
//-------------------------------------//
import { GetServerSidePropsContext } from "next";
import { removeTokenCookie } from "../../lib/auth-cookie";
import { tokenValidation } from "../../lib/jwt-token-validation";

export const getServerSideProps = (context: GetServerSidePropsContext) => {
    // CHECK TOKEN - IF INVALID, RETURN FALSE AND REMOVE TOKEN IN COOKIE
    const token = context.req.cookies.token;
    let result = tokenValidation(token);
    if (result === false) {
        const response = context.res as NextApiResponse;
        removeTokenCookie(response);
    }
    return {
        props:{
            isLoggedIn: result
        }
    }
}