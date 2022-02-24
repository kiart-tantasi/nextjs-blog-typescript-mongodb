import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Lexer, Parser } from "marked";
import ArticleDetail from "../../components/ฺBlog/ArticleDetail";
import NotFoundPage from "../../components/ฺBlog/NotFoundPage";
import { Article } from "../../models/article";

const Article: NextPage = () => {
    const router = useRouter();
    const [ article, setArticle ] = useState<Article>({} as Article);
    const [ notFound, setNotFound ] = useState(false);

    useEffect(() => {
        if (!router.isReady) return;

        const fetchWorkspaceArticle = async() => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
              alert("โปรดเข้าสู่ระบบแอดมิน");
              router.replace("/");
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
                const lexed = Lexer.lex(data.markdown);
                const parsed = Parser.parse(lexed);
                const dataToSetState = {...data, markdown: parsed};
                setArticle(dataToSetState);
            } else if (response.status === 404) {
                setNotFound(true);
            } else {
                alert("session แอดมินหมดอายุ");
                localStorage.removeItem("adminToken");
                router.replace("/");
            }
        }
        fetchWorkspaceArticle();
    }, [router.isReady, router]);

    if (article.title) {

        return <ArticleDetail title={article.title} desc={article.desc} img={article.img} alt={article.alt} date={article.date} markdown={article.markdown} category={article.category} slug={article.slug} views={article.views} />
    }
    if (!article.title && notFound) {
        return <NotFoundPage />
    }
    return <div></div>;
}

export default Article;