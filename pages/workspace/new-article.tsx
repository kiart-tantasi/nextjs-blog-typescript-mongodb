import { NextPage } from "next";
import React from "react";
import Form from "../../components/form/Form";

const NewArticle: NextPage = () => {
    return  <Form editMode={false} />
}
export default NewArticle;