import React, { useRef } from "react";
import styles from "./NewArticlePage.module.css";
import Link from "next/link";
import { Article } from "../../models/article";

import { Lexer, Parser } from "marked";

const NewArticlePage = (props:{handleAddNewArticle: (article: Article) => void;}) => {

    const titleRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);
    const altRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const title = titleRef.current!.value;
        const img = imgRef.current!.value;
        const alt = altRef.current!.value;
        const desc = descRef.current!.value;
        const markdown = textAreaRef.current!.value;

        const lexed = Lexer.lex(markdown);
        console.log("LEXED:", lexed);
        const parsed = Parser.parse(lexed);
        console.log("PARSED", parsed);

        if (!title.length || !img.length || !alt.length || !desc.length || !markdown.length) {
            alert("โปรดระบุหัวข้อ ลิงก์รูปภาพ คำอธิบาย และเนื้อหาบทความให้ครบถ้วน");
            return;
        }

        const sendingData = {
            title: title,
            img: img,
            desc: desc,
            markdown: markdown,
            alt: alt
        }
        props.handleAddNewArticle(sendingData);
        titleRef.current!.value = "";
        imgRef.current!.value = "";
        altRef.current!.value = "";
        descRef.current!.value = "";
        textAreaRef.current!.value = "";
    }

    return (
        <div className={`${styles["form-control"]} row`}>
            <h1 className={styles.heading}>เพิ่มบทความใหม่</h1>
            <form className={styles.form} onSubmit={handleSubmitForm}>
                <div>
                    <input required type="text" placeholder="หัวข้อ" ref={titleRef} />
                </div>
                <div>
                    <input type="text" placeholder="url รูปภาพ" ref={imgRef} />
                    <br />
                    <input type="text" placeholder="คำอธิบายรูปภาพ (กรณีไฟล์รูปหาย)" ref={altRef} />
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
                    <Link href="/"><button type="button">กลับสู่หน้าหลัก</button></Link>
                </div>
            </form>
        </div>
    )
}

export default NewArticlePage;