import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ArticleForm from "../../components/ฺBlog/_ArticleForm"
import { Article, FormData } from "../../models/article";

const Edit: NextPage = () => {
    
    const router = useRouter();
    const [ verified, setVerified ] = useState(false);
    const [ article, setArticle ] = useState<Article>();

    useEffect(() => {
        if (!router.isReady) return;

        const validateUserToken = async() => {
            const slug = router.query.slug;
            const token = localStorage.getItem("adminToken");
            if (!token) {
                alert("โปรดเข้าสู่ระบบแอดมิน");
                router.replace("/");
                return;
            }
            const response = await fetch("/api/edit-data", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({ token, slug })
            });

            if (response.ok) {
                const articleData = await response.json();
                setArticle(articleData);
                setVerified(true);
            } else {
                if (response.status === 401) {
                    alert("session แอดมินหมดอายุ");
                    localStorage.removeItem("adminToken");
                } else if (response.status === 403) {
                    alert("ไม่พบ slug");
                } else if (response.status === 404) {
                    alert("ไม่พบบทความที่ตรงกับ slug");
                }
                router.replace("/");
            }      
        }
        validateUserToken();
    }, [router]);

    const handleEditArticle = async(sendingData: FormData) => {
        
        const response = await fetch("/api/edit-article", {
            method: "PUT",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(sendingData)
        });

        if (response.status === 401) {
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

    if (verified === true) return <ArticleForm handleRequest={handleEditArticle} article={article} />
    return <div></div>;
}

export default Edit;