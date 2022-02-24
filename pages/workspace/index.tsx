import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Articles from '../../components/ฺBlog/Articles';

const WorkSpace: NextPage = () => {
  const router = useRouter();
  const [ articles, setArticles ] = useState([]);

  useEffect(() => {
    const fetchWorkspaceArticles = async() => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("โปรดเข้าสู่ระบบแอดมิน");
        router.replace("/");
        return;
      }
      const response = await fetch("/api/workspace-articles", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({token})
      });
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        alert("session แอดมินหมดอายุ");
        localStorage.removeItem("adminToken");
        router.replace("/");
      }
    }
    fetchWorkspaceArticles();
  }, [router])

    return (
        <>
        <Head><title>WORKSPACE</title></Head>
        <Articles articles={articles} />
        </>
    )
}

export default WorkSpace;
