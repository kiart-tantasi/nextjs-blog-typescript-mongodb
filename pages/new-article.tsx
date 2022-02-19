import NewArticlePage from "../components/ฺBlog/NewArticlePage";
import { Article } from "../models/article";
import React, { useState } from "react";

import Button from '@mui/material/Button';

const NewArticle = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleAddNewArticle = (article: Article) => {

        const sendRequest = async() => {
            const response = await fetch("/api/new-article", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(article)
            });
            if (!response.ok) {
                alert("adding new article failed");
            } else {
                alert("posted new article successfully.");
            }

        }
        sendRequest();
    }

    const handleSubmitLogIn = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggedIn(true);
        alert("เข้าสู่ระบบสำเร็จ");
    }

    if (isLoggedIn) return <NewArticlePage handleAddNewArticle={handleAddNewArticle} />;

    return (
        <div className="row" style={{textAlign:"center"}}>
            <form onSubmit={handleSubmitLogIn}>
                <h4>ไม่ใส่ก็ได้ครับ</h4><br />
                <label htmlFor="id">ไอดี</label><br />
                <input type="text"/><br />
                <label htmlFor="password">รหัสผ่าน</label><br />
                <input type="password" /><br />
                <Button type="submit" size="large">เข้าสู่ระบบ</Button>
            </form>
        </div>
    )
}

export default NewArticle;