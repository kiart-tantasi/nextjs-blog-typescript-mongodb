import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Button from '@mui/material/Button';
import styles from "./Form.module.css";
import { Article } from "../../interfaces/article";

const EditArticleForm = (props: {article: Article}) => {
    const router = useRouter();
    const titleRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);
    const altRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [ textareHeight, setTextareaHeight ] = useState(500);
    const [ preChangeImgUrl, setPreChangeImgUrl ] = useState("");
    const [ imgUrl, setImgUrl ] = useState("");

    useEffect(() => {
        if (!props.article) return;
        const article = props.article;
        titleRef.current!.value = article!.title;
        imgRef.current!.value = article!.img;
        altRef.current!.value = article!.alt;
        descRef.current!.value = article!.desc;
        textAreaRef.current!.value = article!.markdown;
        setPreChangeImgUrl(article!.img);
    }, [props.article]);

    const expandTextarea = () => {
        setTextareaHeight(800);
    }

    const handleImgUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPreChangeImgUrl(value);
    }

    useEffect(() => {
        const changeUrlTimer = setTimeout(() => {
            setImgUrl(preChangeImgUrl);
        }, 1000);
        return () => clearTimeout(changeUrlTimer);
    }, [preChangeImgUrl]);

    const handleSubmitForm = async(e: React.FormEvent) => {
        e.preventDefault();
        const title = titleRef.current!.value;
        const img = imgRef.current!.value;
        const alt = altRef.current!.value;
        const desc = descRef.current!.value;
        const markdown = textAreaRef.current!.value;
        const category = props.article.category;
        const slug = props.article.slug;
        if (!title.length || !img.length || !alt.length || !desc.length || !markdown.length || !category.length || !slug.length) {
            alert("ข้อมูลในการแก้ไขบทความไม่ครบถ้วน");
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
        const response = await fetch("/api/edit-article", {
            method: "PUT",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(sendingData)
        });
        if (response.status === 401) {
            alert("session admin หมดอายุ");
            return;
        } else if (!response.ok) {
            alert("แก้ไขบทความล้มเหลว !");
            const json = await response.json();
            alert(JSON.stringify(json));
            return;
        } else {
            if (props.article?.category !== "workspace") alert("แก้ไขบทความสำเร็จ - แอปพลิเคชั่นจะใช้เวลาประมาณ 10 วินาทีเพื่อ render หน้าบทความใหม่");
            else if (props.article.category === "workspace") alert("แก้ไขบทความสำเร็จ (workspace)");
            const linkToPushTo = (props.article!.category === "workspace")? ("/workspace/" + props.article!.slug): ("/article/" + props.article!.slug);
            router.push(linkToPushTo);
        }
    }

    return (
        <>
        <div className={styles["nav-top"]}>
            <Button type="button" onClick={() => router.back()}>กลับ</Button>
        </div>
        <div className={`${styles["form-container"]} row`}>
            <h1 className={styles.heading}>แก้ไขบทความ</h1>
            <form className={styles.form} onSubmit={handleSubmitForm}>
                <div>
                    <label>หัวข้อ</label>
                    <input type="text" ref={titleRef} />
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
                    <Button onClick={expandTextarea}>ขยาย Textarea</Button>
                    <br/>
                    <h3>เนื้อหาบทความ</h3>
                    <textarea ref={textAreaRef} style={{height: textareHeight.toString() + "px"}} />
                </div>
                <div>
                    <Button type="submit" className={styles["submit-button"]}>แก้ไขบทความ</Button>
                </div>
            </form>
        </div>
        </>
    )
}

export default EditArticleForm;