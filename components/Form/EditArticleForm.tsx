import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Lexer, Parser } from "marked";
import CardPreview from "./CardPreview";
import ArticlePreview from "./ArticlePreview";
import Button from '@mui/material/Button';
import styles from "./Form.module.css";
import { Article, PreviewData } from "../../interfaces/article";

const EditArticleForm = (props: {article: Article}) => {
    const router = useRouter();
    // FORM
    const titleRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLInputElement>(null);
    const altRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    // PREVIEW
    const [ preview, setPreview ] = useState(false);
    const [ previewData, setPreviewData ] = useState<PreviewData>({} as PreviewData);

    useEffect(() => {
        if (!props.article) return;
        const article = props.article;
        titleRef.current!.value = article!.title;
        imgRef.current!.value = article!.img;
        altRef.current!.value = article!.alt;
        descRef.current!.value = article!.desc;
        textAreaRef.current!.value = article!.markdown;
    }, [props.article]);

    const handlePreview = () => {
        const lexed = Lexer.lex(textAreaRef.current?.value || "ไม่มี markdown");
        const parsed = Parser.parse(lexed);
        const dataToSet: PreviewData = {
            title: titleRef.current?.value || "ไม่มีหัวข้อ" ,
            img: imgRef.current?.value || "ไม่มี url รูปภาพ",
            alt: altRef.current?.value || "ไม่มี alt รูปภาพ",
            desc: descRef.current?.value || "ไม่มีคำอธิบายบทความ",
            markdown: parsed,
            date: Date.now(),
            views: 100
        }
        setPreviewData(dataToSet)
        if (preview === false) setPreview(true);
    }

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
            return alert("ข้อมูลไม่ครบถ้วน");
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
        
        if (response.status === 401) return alert("session admin หมดอายุ"); 
        if (!response.ok) return alert("แก้ไขบทความล้มเหลว !");

        alert((props.article.category === "workspace")? "แก้ไขบทความสำเร็จ (workspace)": "แก้ไขบทความสำเร็จ - แอปพลิเคชั่นจะใช้เวลาประมาณ 10 วินาทีเพื่อ render หน้าบทความใหม่");
        const linkToPushTo = (props.article!.category === "workspace")? ("/workspace/" + props.article!.slug): ("/article/" + props.article!.slug);
        router.push(linkToPushTo);
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

                {/* EDIT AND PREVIEW SECTION */}
                <button type="button" className={styles["preview-button"]} onClick={handlePreview}>{preview? "รีเฟรช": "ดูตัวอย่าง"}</button>
                <div className={styles["edit-preview"]}>
                    <div className={styles.edit}>
                        <br/>
                        <h3>เนื้อหาบทความ</h3>
                        <textarea ref={textAreaRef} />
                    </div>
                    {preview && <div className={styles.preview}>
                        <ArticlePreview previewData={previewData} />
                    </div>}
                </div>
                {/* ----------------------- */}

                <button type="submit" className={styles["submit-button"]}>แก้ไขบทความ</button>
            </form>
        </div>
        {preview && <CardPreview previewData={previewData} category={props.article!.category} slug={props.article!.slug} />}
        </>
    )
}

export default EditArticleForm;