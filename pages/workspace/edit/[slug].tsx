import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EditWorkspaceArticle = () => {
    const router = useRouter();
    const [ test, setTest ] = useState("Loading...");

    useEffect(() => {
        if (!router.isReady) return;
        const token = localStorage.getItem("adminToken");
        if (!token) {
            alert("โปรดเข้าสู่ระบบแอดมิน");
            router.replace("/");
            return;
        }
        const validateToken = async() => {
            const response = await fetch("/api/validate-token", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({token})
            });
            if (!response.ok) {
                alert("session แอดมินหมดอายุ");
                router.replace("/");
            } else {
                const slug = router.query.slug as string;
                setTest(slug);
            }
        }
        validateToken();
    }, [router]);

    return <div style={{textAlign:"center", paddingTop: "70px"}}>{test}</div>
}

export default EditWorkspaceArticle;