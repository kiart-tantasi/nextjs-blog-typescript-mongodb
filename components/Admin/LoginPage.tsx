import { useRef } from "react";
import { Button } from "@mui/material";

const LoginPage = (props:{handleLogIn:(username:string, password:string) => void;}) => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmitLogIn = async(e: React.FormEvent) => {
        e.preventDefault();
        const username = usernameRef.current!.value;
        const password = passwordRef.current!.value;
        if (!username.length || !password.length) alert("โปรดระบุ username และ password ให้ครบถ้วน");
        else props.handleLogIn(username, password);
    }

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

export default LoginPage;