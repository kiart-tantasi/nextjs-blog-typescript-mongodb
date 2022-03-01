import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import slugify from "slugify";
import { Lexer, Parser } from "marked";
import { allowedCategories } from "../../utils/sharedData";
import ArticleCard from "../UI/ArticleCard";
import { Button } from "@mui/material";
import styles from "./Form.module.css";
import { ArticleTypes } from "../../interfaces/article";

const NewArticleForm = () => {
    // FORM
    const router = useRouter();
    const titleRef = useRef<HTMLInputElement>(null);
    const slugRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);
    const altRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [ categoryValue, setCategoryValue ] = useState<ArticleTypes>("");
    const [ textareHeight, setTextareaHeight ] = useState(500);
    // PREVIEW
    const [ preview, setPreview ] = useState(false);
    const [ parsedMarkdown, setParsedMarkdown ] = useState("");

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as ArticleTypes;
        setCategoryValue(newValue);
    }

    const expandTextarea = () => {
        setTextareaHeight(800);
    }

    const handleTogglePreview = () => {
        const lexed = Lexer.lex(textAreaRef.current?.value || "ไม่มี markdown");
        const parsed = Parser.parse(lexed);
        setParsedMarkdown(parsed);
        setPreview(prev => !prev);
    }

    const handleSubmitForm = async(e: React.FormEvent) => {
        e.preventDefault();
        const title = titleRef.current!.value;
        const img = imgRef.current!.value;
        const alt = altRef.current!.value;
        const desc = descRef.current!.value;
        const markdown = textAreaRef.current!.value;
        const category = categoryValue;
        const slug = slugify(slugRef.current!.value);
        if (!title.length || !img.length || !alt.length || !desc.length || !markdown.length || !slug.length || category === "") {
            alert("ข้อมูลไม่ครบถ้วน หรือ slug ไม่ใช่ภาษาอังกฤษ");
            return;
        }
        if (!allowedCategories.includes(category)) {
            alert("หมวดหมู่ไม่ถูกต้อง");
            return;
        }
        const sendingData = {
            title: title,
            img: img,
            alt: alt,
            desc: desc,
            markdown: markdown,
            category: category,
            slug: slug
        }
        const response = await fetch("/api/new-article", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(sendingData)
        });
        if (response.status === 401) {
            alert("session แอดมินหมดอายุ");
            return;
        } else if (!response.ok) {
            alert("เพิ่มบทความล้มเหลว !");
            return;
        } else {
            alert("เพิ่มบทความสำเร็จ");
            titleRef.current!.value = "";
            slugRef.current!.value = "";
            imgRef.current!.value = "";
            altRef.current!.value = "";
            descRef.current!.value = "";
            textAreaRef.current!.value = "";
        }
    }

    return (
        <>
        <div className={styles["nav-top"]}>
            <Button type="button" onClick={() => router.back()}>กลับ</Button>
        </div>
        <div className={`${styles["form-container"]} row`}>
            <h1 className={styles.heading}>เพิ่มบทความใหม่</h1>
            <form className={styles.form} onSubmit={handleSubmitForm}>
                <div>
                    <label>หัวข้อ</label>
                    <input type="text" ref={titleRef} />
                    
                    <label>slug (ภาษาอังกฤษ)</label>
                    <input className={styles["secondary-input"]} type="text" ref={slugRef} />

                </div>
                <div> 
                    <label>url รูปภาพ</label>
                    <input type="text" ref={imgRef} />
                    <label>คำอธิบายรูปภาพ (กรณีไฟล์รูปหาย)</label>
                    <input className={styles["secondary-input"]} type="text" ref={altRef} />
                </div>
                <div>
                    <label>คำอธิบายบทความ</label>
                    <input className={styles.desc} type="text" ref={descRef} />
                </div>
                <div>
                    <button type="button" className={styles["expand-button"]} onClick={expandTextarea}>ขยาย Textarea</button>
                    <br/>
                    <h3>เนื้อหาบทความ</h3>
                    <textarea ref={textAreaRef} style={{height: textareHeight.toString() + "px"}} />
                </div>
                <div>
                    <label htmlFor="category">หมวดหมู่</label>
                    <select name="category" onChange={handleSelectChange}>
                        <option value="">เลือก</option>
                        <option value="tech">เทค</option>
                        <option value="gaming">เกมมิ่ง</option>
                        <option value="workoutandhealth">ออกกำลังกายและสุขภาพ</option>
                        <option value="others">อื่น ๆ </option>
                        <option value="workspace">workspace</option>
                    </select>
                </div>
                <div className={styles["two-buttons"]}>
                    <button type="submit" className={styles["submit-button"]}>เพิ่มบทความใหม่</button>
                    <button type="button" className={styles["preview-button"]} onClick={handleTogglePreview}>เปิด/ปิดตัวอย่าง</button>
                </div>
            </form>
        </div>
        {preview &&
        <>
        <hr />
        <ArticleCard
        title={titleRef.current?.value || "ไม่มีหัวข้อ"}
        img={imgRef.current?.value || "ไม่มีรูปภาพ"}
        alt={altRef.current?.value || "ไม่มี alternatives"}
        desc={descRef.current?.value || "ไม่มีคำอธิบายบทความ"}
        markdown={parsedMarkdown || "ไม่มี markdown"}
        date={Date.now()}
        views={123}
        />
        </>}
        </>
    )
}

export default NewArticleForm;
