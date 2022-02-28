import { Button } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import styles from "./ModalUI.module.css";
import { Article, ArticleTypes } from "../../interfaces/article";
import { allowedCategories } from "../../utils/sharedData";
import slugify from "slugify";

const PostToPublicModalUI = (props:{article: Article; onClose: () => void; replaceWithHome: () => void;}) => {
    const [ categoryValue, setCategoryValue ] = useState<ArticleTypes>("");
    const slugRef = useRef<HTMLInputElement>(null);

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectValue = e.target.value as ArticleTypes;
        setCategoryValue(selectValue);
    }

    const handlePostToPublic = () => {
        const slugValue = slugRef.current!.value;
        const slug = slugify(slugValue);
        if (!slug.length) {
            alert("slug ไม่ถูกต้อง");
            return;
        }
        if (!allowedCategories.includes(categoryValue) || categoryValue === "workspace") {
            alert("หมวดหมู่ไม่ถูกต้อง");
            return;
        }
        const sendRequest = async() => {
            const sendingArticle: Article = {
                title: props.article.title,
                desc: props.article.desc,
                markdown: props.article.markdown,
                img: props.article.img,
                alt: props.article.alt,
                date: Date.now(),
                category: categoryValue,
                slug: slugRef.current!.value,
            }
            const workspaceSlug = props.article.slug;
            const sendingData = {...sendingArticle, workspaceSlug: workspaceSlug};
            const response = await fetch("/api/workspace-to-public", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(sendingData)
            });

            if (response.ok) {
                alert("โพสต์ไปยัง PUBLIC สำเร็จ");
                props.onClose();
                props.replaceWithHome();
            } else {
                const data = await response.json();
                alert("ล้มเหลว: " + data.message);
            }
        }
        sendRequest();
    }

    return (
        <>
        <div onClick={() => props.onClose()} className={styles.modalBackdrop} />
        <div className={styles.modal}>
            <div className={styles["modal-content"]}>

                <p>ต้องแก้โพสต์บทความไปที่ Public</p>
                <br />

                <label>slug</label>
                <br />
                <input type="text" ref={slugRef} />
                <br /><br />

                <select name="category" onChange={handleSelectChange}>
                    <option value="">เลือก</option>
                    <option value="tech">เทค</option>
                    <option value="gaming">เกมมิ่ง</option>
                    <option value="workoutandhealth">ออกกำลังกายและสุขภาพ</option>
                    <option value="others">อื่น ๆ </option>
                </select>

            </div>

            <div className={styles.buttons}>
                <Button onClick={props.onClose}>ยกเลิก</Button>
                <Button color="success" onClick={handlePostToPublic}>ยืนยัน</Button>
            </div>
        </div>
        </>
    )
}

export default PostToPublicModalUI;