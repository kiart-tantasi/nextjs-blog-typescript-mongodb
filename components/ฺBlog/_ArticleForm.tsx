import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import slugify from "slugify";
import Button from '@mui/material/Button';
import styles from "./_ArticleForm.module.css";

import { ArticleTypes, ArticleForm } from "../../models/article";

const _ArticleForm = (props: ArticleForm) => {
    const router = useRouter();
    const titleRef = useRef<HTMLInputElement>(null);
    const slugRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);
    const altRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [categoryValue, setCategoryValue] = useState<ArticleTypes>("");
    const [imgUrl, setImgUrl] = useState("");

    useEffect(() => {

        if (props.article === undefined) return;
        const article = props.article;
        titleRef.current!.value = article!.title;
        imgRef.current!.value = article!.img;
        altRef.current!.value = article!.alt;
        descRef.current!.value = article!.desc;
        textAreaRef.current!.value = article!.markdown;
        setImgUrl(article!.img);
    }, []);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as ArticleTypes;
        setCategoryValue(newValue);
    }

    const handleImgUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setImgUrl(value);
    }

    const handleSubmitForm = async(e: React.FormEvent) => {
        e.preventDefault();
        const title = titleRef.current!.value;
        const img = imgRef.current!.value;
        const alt = altRef.current!.value;
        const desc = descRef.current!.value;
        const markdown = textAreaRef.current!.value;
        const category = props.article? props.article.category: categoryValue;
        const slug = props.article? props.article.slug: slugify(slugRef.current!.value);
        const date = props.article? props.article.date: Date.now();

        if (props.article === undefined) {
            if (!title.length || !img.length || !alt.length || !desc.length || !markdown.length || !slug.length || categoryValue === "") {
                alert("ข้อมูลไม่ครบถ้วน หรือ slug ไม่ใช่ภาษาอังกฤษ");
                return;
            }
        } else {
            if (!title.length || !img.length || !alt.length || !desc.length || !markdown.length) {
                alert("ข้อมูลในการแก้ไขบทความไม่ครบถ้วน");
                return;
            } 
        }

        const token = localStorage.getItem("adminToken");
        if (!token) {
            alert("ไม่พบ token แอดมิน");
            return;
        }
        const sendingData = {
            title: title,
            img: img,
            alt: alt,
            desc: desc,
            markdown: markdown,
            date: date,
            category: category,
            slug: slug,
            token: token
        }
        const result = await props.handleRequest(sendingData);
        
        if (result === false) return;

        if (props.article !== undefined) {
            router.replace("/" + props.article.slug);
            return;
        }

        titleRef.current!.value = "";
        slugRef.current!.value = "";
        imgRef.current!.value = "";
        altRef.current!.value = "";
        descRef.current!.value = "";
        textAreaRef.current!.value = "";
        setImgUrl("");
    }

    return (
        <div className={`${styles["form-control"]} row`}>
            <h1 className={styles.heading}>{props.article? "แก้ไขบทความ": "เพิ่มบทความใหม่"}</h1>
            <form className={styles.form} onSubmit={handleSubmitForm}>
                <div>
                    <label>หัวข้อ</label>
                    <input type="text" ref={titleRef} />
                    {!props.article &&
                    <>
                    <label>slug (ภาษาอังกฤษ)</label>
                    <input className={styles["secondary-input"]} type="text" ref={slugRef} />
                    </>}
                </div>
                {imgUrl !== "" && <img src={imgUrl} alt="รูปตัวอย่าง" />}
                <div> 
                    <label>url รูปภาพ</label>
                    <input onChange={handleImgUrlChange} type="text" ref={imgRef} />
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
                {!props.article && <div>
                    <label htmlFor="category">หมวดหมู่</label>
                    <select name="category" onChange={handleSelectChange}>
                        <option value="">เลือก</option>
                        <option value="tech">เทค</option>
                        <option value="gaming">เกมมิ่ง</option>
                        <option value="workoutandhealth">ออกกำลังกายและสุขภาพ</option>
                        <option value="others">อื่น ๆ </option>
                    </select>
                </div>}
                <div>
                    <Button type="submit" className={styles["submit-button"]}>{props.article? "แก้ไขบทความ": "เพิ่มบทความใหม่"}</Button>
                </div>
                <div>
                    <Link href="/"><Button type="button">กลับสู่หน้าหลัก</Button></Link>
                </div>
            </form>
        </div>
    )
}

export default _ArticleForm;