import React, { useRef, useState } from "react";
import styles from "./NewArticlePage.module.css";
import Link from "next/link";

import { Article } from "../../models/article";
import { ArticleTypes } from "../../models/article";

import slugify from "slugify";

const NewArticlePage = (props:{handleAddNewArticle: (article: Article) => void;}) => {

    const titleRef = useRef<HTMLInputElement>(null);
    const slugRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);
    const altRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [categoryValue, setCategoryValue] = useState<ArticleTypes>("");

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as ArticleTypes;
        setCategoryValue(newValue);
    }

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const title = titleRef.current!.value;
        const img = imgRef.current!.value;
        const alt = altRef.current!.value;
        const desc = descRef.current!.value;
        const markdown = textAreaRef.current!.value;
        const slug = slugify(slugRef.current!.value);

        if (!title.length || !img.length || !alt.length || !desc.length || !markdown.length || !slug.length || categoryValue === "") {
            alert("ข้อมูลไม่ครบถ้วน หรือ ไม่ถูกต้องตามเงื่อนไข");
            return;
        }

        const sendingData = {
            title: title,
            img: img,
            desc: desc,
            markdown: markdown,
            alt: alt,
            date: Date.now(),
            category: categoryValue,
            slug: slug
        }
        props.handleAddNewArticle(sendingData);
        titleRef.current!.value = "";
        slugRef.current!.value = "";
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
                    <h3>เนื้อหาบทความ</h3>
                    <textarea ref={textAreaRef} />
                </div>
                <div>
                    <label htmlFor="category">หมวดหมู่</label>
                    <select name="category" onChange={handleSelectChange}>
                        <option value="">เลือก</option>
                        <option value="tech">เทค</option>
                        <option value="gaming">เกมมิ่ง</option>
                        <option value="english">ภาษาอังกฤษ</option>
                        <option value="workoutandhealth">ออกกำลังกายและสุขภาพ</option>
                        <option value="others">อื่น ๆ </option>
                    </select>
                </div>
                <div>
                    <button type="submit" className={styles["submit-button"]}>เพิ่มบทความใหม่</button>
                </div>
                <div>
                    <Link href="/"><button type="button">กลับสู่หน้าหลัก</button></Link>
                </div>
            </form>
        </div>
    )
}

export default NewArticlePage;