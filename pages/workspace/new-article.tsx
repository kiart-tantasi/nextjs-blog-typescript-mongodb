import { NextPage } from "next";
import React from "react";
import Form from "../../components/Form/Form";

const NewArticle: NextPage = () => {
    return  <Form editMode={false} />
}
export default NewArticle;