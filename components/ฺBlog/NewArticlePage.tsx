import React, { useRef } from "react";
import styles from "./NewArticlePage.module.css";
import Link from "next/link";
import { Article } from "../../models/article";

const NewArticlePage = (props:{handleAddNewArticle: (article: Article) => void;}) => {

    const titleRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const title = titleRef.current!.value;
        const desc = descRef.current!.value;
        const markdown = textAreaRef.current!.value;
        if (!title.length || !desc.length || !markdown.length) {
            alert("โปรดระบุหัวข้อ คำอธิบาย และเนื้อหาบทความให้ครบถ้วน");
            return;
        }
        const sendingData = {
            title: title, 
            desc: desc, 
            markdown: markdown
        }
        props.handleAddNewArticle(sendingData);
        titleRef.current!.value = "";
        descRef.current!.value = "";
        textAreaRef.current!.value = "";
    }

    return (
        <div className={`${styles["form-control"]} row`}>
            <h1 className={styles.heading}>เพิ่มบทความใหม่</h1>
            <form className={styles.form} onSubmit={handleSubmitForm}>
                <div>
                    <input type="text" placeholder="หัวข้อ" ref={titleRef} />
                </div>
                <div>
                    <input type="text" placeholder="คำอธิบาย" ref={descRef} />
                </div>
                <div>
                    <h3>เนื้อหาบทความ</h3>
                    <textarea ref={textAreaRef} />
                </div>
                <div>
                    <button type="submit">เพิ่มบทความใหม่</button>
                </div>
                <div>
                    <Link href="/">กลับสู่หน้าหลัก</Link>
                </div>
            </form>
        </div>
    )
}

export default NewArticlePage;