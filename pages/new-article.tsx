import ArticleForm from "../components/ฺBlog/_ArticleForm";
import React, { useEffect, useRef, useState } from "react";
import { FormData } from "../models/article";
import Button from '@mui/material/Button';

const NewArticle = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tokenChecked, setTokenChecked] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const validateUserToken = async() => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setTokenChecked(true); 
                return;
            }

            const response = await fetch("/api/validate-token", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({token: token})
            });

            if (!response.ok) {
                localStorage.removeItem("adminToken");
                setIsLoggedIn(false);
            } else {
                setIsLoggedIn(true);
            }
            setTokenChecked(true);
        }
        validateUserToken();
    }, [])

    const handleAddNewArticle = async(sendingData: FormData) => {

        const response = await fetch("/api/new-article", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(sendingData)
        });

        if (response.status === 400) {
            alert("slug นี้ถูกใช้ไปแล้ว");
            return false;
        } else if (response.status === 401) {
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

    const handleSubmitLogIn = (e: React.FormEvent) => {
        e.preventDefault();
        // setIsLoggedIn(true);
        // alert("เข้าสู่ระบบสำเร็จ");
        // return;

        const loginAdmin = async() => {
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
                const json:{message:string; token:string} = await response.json();
                const adminToken = json.token;
                localStorage.setItem("adminToken", adminToken);
                setIsLoggedIn(true);
                alert("เข้าสู่ระบบสำเร็จ");
            }
        }
        loginAdmin();
    }

    if (isLoggedIn) return <ArticleForm handleRequest={handleAddNewArticle} />;

    if (tokenChecked) {
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

    return <div></div>
}

export default NewArticle;