import { useRouter } from "next/router";
import ArticleForm from "../components/ฺBlog/_ArticleForm";
import React, { useRef, useState } from "react";
import { FormData } from "../models/article";
import Button from '@mui/material/Button';
import { NextApiResponse, NextPage } from "next";

const NewArticle: NextPage<{isLoggedIn: boolean}> = (props) => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn? props.isLoggedIn: false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

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

    const handleSubmitLogIn = async(e: React.FormEvent) => {
        e.preventDefault();
        const username = usernameRef.current!.value;
        const password = passwordRef.current!.value;
        if (!username.length || !password.length) {
            alert("โปรดระบุ username และ password");
            return;
        }
        const response = await fetch("/api/login-admin", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({username,password})
        });
        if (!response.ok) {
            alert("โปรดตรวจสอบ username และ password");
        } else {
            alert("เข้าสู่ระบบสำเร็จ");
            setIsLoggedIn(true);
        }
    }

    const handleSubmitLogout = async() => {
        const response = await fetch("/api/logout-admin");
        if (!response.ok) {
            alert("การออกจากระบบล้มเหลว");
        } else {
            alert("ออกจากระบบสำเร็จ");
            router.replace("/");
        }
    }

    if (isLoggedIn) return (
        <>
        <div style={{textAlign:"right", paddingRight: "30px", paddingTop:"10px"}}>
        <Button onClick={handleSubmitLogout}>ออกจากระบบ</Button>
        </div>
        <ArticleForm handleRequest={handleAddNewArticle} />
        </>
    )
    return (
        <div className="row" style={{textAlign:"center", padding:"100px 0"}}>
            <form onSubmit={handleSubmitLogIn}>
                <label htmlFor="id">ชื่อผู้ใช้งาน</label><br />
                <input type="text" ref={usernameRef} /><br />
                <label htmlFor="password">รหัสผ่าน</label><br />
                <input type="password" ref={passwordRef} /><br />
                <Button type="submit" size="large">เข้าสู่ระบบ</Button>
            </form>
        </div>
    )
}
export default NewArticle;
//-------------------------------------//
import { GetServerSidePropsContext } from "next";
import { removeTokenCookie } from "../lib/auth-cookie";
import { tokenValidation } from "../lib/jwt-token-validation";

export const getServerSideProps = (context: GetServerSidePropsContext) => {
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