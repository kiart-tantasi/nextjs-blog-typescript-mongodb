import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ArticleDetail from "../../components/ฺBlog/ArticleDetail";
import { Article } from "../../models/article";

const Article: NextPage = () => {
    const router = useRouter();
    const [ article, setArticle ] = useState<Article>({} as Article);

    useEffect(() => {
        if (!router.isReady) return;

        const fetchWorkspaceArticle = async() => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
              alert("โปรดเข้าสู่ระบบแอดมิน");
              router.back();
              return;
            }
            const slug = router.query.slug;
            const response = await fetch("/api/workspace-article", {
              method: "POST",
              headers: {"Content-Type":"application/json"},
              body: JSON.stringify({token, slug})
            });
            if (response.ok) {
                const data = await response.json();
                setArticle(data);
            } else {
                alert("session แอดมินหมดอายุ");
                localStorage.removeItem("adminToken");
                router.replace("/");
            }
        }
        fetchWorkspaceArticle();
    }, [router.isReady]);

    if (article.title) {
        return <ArticleDetail title={article.title} desc={article.desc} img={article.img} alt={article.alt} date={article.date} markdown={article.markdown} category={article.category} slug={article.slug} views={article.views} />
    }
    return <div></div>;
}

export default Article;