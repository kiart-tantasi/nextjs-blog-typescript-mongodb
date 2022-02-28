import { NextApiResponse, NextPage } from "next";
import React from "react";
import NewArticleForm from "../../components/Form/NewArticleForm";
import NotFoundPage from "../../components/ฺBlog/NotFoundPage";

const NewArticle: NextPage<{isLoggedIn: boolean}> = (props) => {
    if (props.isLoggedIn) return  <NewArticleForm />
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