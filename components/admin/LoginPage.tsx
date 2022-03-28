import { useRouter } from "next/router";
import { useContext, useRef } from "react";
import AuthContext from "../../context/auth-context";
import { Button } from "@mui/material";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
    const router = useRouter();
    const AuthCtx = useContext(AuthContext);
    const { logIn } = AuthCtx;
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmitLogIn = async(e: React.FormEvent) => {
        e.preventDefault();
        const username = usernameRef.current!.value;
        const password = passwordRef.current!.value;
        if (!username.length || !password.length) return alert("โปรดระบุ username และ password ให้ครบถ้วน");
        const response = await fetch("/api/login-admin", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({username: username, password: password})
        });
        if (response.status === 403) {
            alert("ใส่พาสเวิร์ดผิดเกินจำนวนครั้งที่กำหนด!");
        } else if (!response.ok) {
            alert("โปรดตรวจสอบ username และ password");
        } else {
            alert("เข้าสู่ระบบสำเร็จ");
            logIn();
            router.replace("/workspace");
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmitLogIn}>
                <label htmlFor="id">ชื่อผู้ใช้งาน</label><br />
                <input type="text" ref={usernameRef} /><br />
                <label htmlFor="password">รหัสผ่าน</label><br />
                <input type="password" ref={passwordRef} /><br />
                <Button type="submit" size="large">เข้าสู่ระบบ</Button>
            </form>
        </div>
    )
}

export default LoginPage;