import { useRouter } from "next/router";
import { useState } from "react"
import ArticleCardUI from "../UI/ArticleCardUI"
import ModalUI from "../UI/ModalUI";
import Button from "@mui/material/Button";
import { Article } from "../../interfaces/article"

const DeletedArticlePage = (props: {article: Article}) => {
    const router = useRouter();
    const [ recoverModal, setRecoverModal] = useState(false);
    const [ permanentDeleteModal, setPermanentDeleteModal] = useState(false);

    const handleRecover = async() => {
        const sendingData = {
            slug: props.article.slug,
            category: props.article.category
        }

        const response = await fetch("/api/recover-article", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(sendingData)
        });

        if (response.ok) {
            setRecoverModal(false);
            alert("กู้คืนสำเร็จ! (testing)");
            router.replace("/workspace/bin");
        } else {
            setRecoverModal(false);
            alert("กู้คืนล้มเหลว");
        }
    }

    const handePermanentDelete = async() => {
        const response = await fetch("/api/delete-article-permanently", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({slug: props.article.slug})
        })
        if (response.ok) {
            const json = await response.json();
            console.log(json);

            alert("ลบถาวรสำเร็จ !!!");
            setPermanentDeleteModal(false);
            router.replace("/workspace/bin");
        } else {
            setPermanentDeleteModal(false);
            alert("ลบถาวรล้มเหลว");
        }
    }

    return (
        <>
        {/* RECOVER MODAL */}
        {recoverModal &&
        <ModalUI text="ยืนยันที่จะกู้คืนบทความ" 
            important onConfirm={handleRecover} 
            onClose={() => setRecoverModal(false)} 
        />
        }

        {/* PERMANENT DELETE MODAL */}
        {permanentDeleteModal &&
        <ModalUI text="!!! โปรดพิมพ์ slug เพื่อลบถาวร !!!" 
            important
            delete={{delete:true, slug: props.article.slug}}
            onConfirm={handePermanentDelete}
            onClose={() => setPermanentDeleteModal(false)}
        />}

        <div style={{paddingRight: 30, paddingTop: 15, textAlign: "right"}}>
            <Button color="success" size="large" onClick={() => setRecoverModal(true)}>กู้คืน</Button>
            <Button color="error" onClick={() => setPermanentDeleteModal(true)}>ลบถาวร</Button>
        </div>
        <ArticleCardUI 
        title={props.article.title} 
        desc={props.article.desc} 
        img={props.article.img} 
        alt={props.article.alt} 
        date={props.article.date} 
        views={props.article.views} 
        markdown={props.article.markdown} />
        </>
    )
}

export default DeletedArticlePage;