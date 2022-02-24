import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EditIndexPage = () => {
    const router = useRouter();
    const [ verified, setVerified ] = useState(false);

    useEffect(() => {
        const validateUserToken = async() => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                alert("โปรดเข้าสู่ระบบแอดมิน");
                router.replace("/");
                return;
            }
            const response = await fetch("/api/validate-token", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({ token })
            });
            if (!response.ok) {
                localStorage.removeItem("adminToken")
                alert("session แอดมินหมดอายุ");
                router.replace("/");
            } else {
                setVerified(true);
            }
        }

        validateUserToken();
    }, [router]);

    if (verified) {
        return (
            <div style={{textAlign:"center", paddingTop:"70px"}}>
                <p>put slug of the article you want to edit after /edit/ </p>
            </div>
        )
    }
    return <div></div>
}

export default EditIndexPage;