import ArticleForm from "../components/ฺBlog/_ArticleForm";
import React, { useRef, useState } from "react";
import { Article } from "../models/article";
import Button from '@mui/material/Button';

const NewArticle = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleAddNewArticle = async(article: Article) => {

        const response = await fetch("/api/new-article", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(article)
        });

        if (response.status === 400) {
            alert("slug นี้ถูกใช้ไปแล้ว");
            return false;
        } else if (!response.ok) {
            alert("เพิ่มบทความล้มเหลว !");
            return false;
        } else {
            alert("เพิ่มบทความสำเร็จ");
            return true;
        }
    }

    const handleSubmitLogIn = (e: React.FormEvent) => {
        e.preventDefault();
        alert("เข้าสู่ระบบสำเร็จ");
        setIsLoggedIn(true);

        // const loginAdmin = async() => {
        //     const username = usernameRef.current!.value;
        //     const password = passwordRef.current!.value;
        //     if (!username.length || !password.length) {
        //         alert("โปรดระบุ username และ password");
        //         return;
        //     }
        //     const response = await fetch("/api/login-admin", {
        //         method: "POST",
        //         headers: {"Content-Type" : "application/json"},
        //         body: JSON.stringify({username,password})
        //     });
    
        //     if (!response.ok) {
        //         alert("เข้าสู่ระบบล้มเหลว !");
        //     } else {
        //         alert("เข้าสู่ระบบสำเร็จ");
        //     }
        //     const json = await response.json();
        //     console.log("JSON:", json);
        // }
        // loginAdmin();
    }

    // const handleRegisterAdmin = async(username:string, password:string, firstName:string, lastName:string) => {
    //     const adminData = {
    //         username,
    //         password,
    //         firstName,
    //         lastName
    //     }
    //     const response = await fetch("/api/register-admin", {
    //         method: "POST",
    //         headers: {"Content-Type" : "application/json"},
    //         body: JSON.stringify(adminData)
    //     });
    //     if (!response.ok) {
    //         alert("RESPONSE IS NOT OKAY !");
    //     } else {
    //         alert("ลงทะเบียนแอดมินสำเร็จ");
    //     }
    // }

    if (isLoggedIn) return <ArticleForm handleRequest={handleAddNewArticle} />;

    return (
        <div className="row" style={{textAlign:"center"}}>
            <form onSubmit={handleSubmitLogIn}>
                <h4>ใส่อะไรก็ได้ครับ</h4><br />
                <label htmlFor="id">USERNAME</label><br />
                <input type="text" ref={usernameRef} /><br />
                <label htmlFor="password">PASSWORD</label><br />
                <input type="password" ref={passwordRef} /><br />
                <Button type="submit" size="large">เข้าสู่ระบบ</Button>
            </form>
        </div>
    )
}

export default NewArticle;