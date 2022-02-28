import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth-context';
import Card from '@mui/material/Card';
import { Button, CardMedia } from '@mui/material';
import styles from "./ArticleDetail.module.css";
import { Article } from '../../models/article';
import ModalUI from '../UI/ModalUI';

export default function ArticleDetail(props: Article) {
    const router = useRouter();
    const AuthCtx = useContext(AuthContext);
    const { isAdmin } = AuthCtx;
    const [ deleteModal, setDeleteModal ] = useState(false);

    useEffect(() => {
        const incView = async() => {
            if (!props.slug || !props.category) return;
            const { slug, category } = props;
            await fetch("/api/inc-view", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({ slug, category })
            });
        }
        setTimeout(() => {
            incView();
        }, 2000);
    }, [props]);

    const handleDelete = async() => {
        const response = await fetch("/api/delete-article", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({slug: props.slug, category: props.category})
        })
        if (response.ok) {
            setDeleteModal(false);
            alert("ลบบทความสำเร็จ");
            if (props.category === "workspace") {
                router.replace("/workspace");
            } else {
                router.replace("/");
            }
        } else {
            setDeleteModal(false);
            alert("ลบบทความล้มเหลว");
        }
    }

    return (
        <>
            {/* TITLE AND META */}
            <Head>
                <title>{props.title}</title>
                <meta name='description'content={props.desc} />
            </Head>

            {/* DELETE MODAL */}
            {deleteModal &&
            <ModalUI text="ต้องการลบบทความนี้" onConfirm={handleDelete} onClose={() => setDeleteModal(false)} />
            }

            {/* NAV FOR ADMIN */}
            {isAdmin && <div className={styles["nav-top"]}>
                <Button onClick={() => router.back()}>กลับ</Button>
                <Button><Link href="/workspace">WORKSPACE</Link></Button>
                <Button><Link href={"/edit/" + props.slug}>แก้ไข</Link></Button>
                <Button color="warning" onClick={() => setDeleteModal(true)}>ลบ</Button>
            </div>}

            {/* ARTICLE  */}
            <article className={styles["article-author-container"]}>
                <Card className={styles.article}>
                    <section>
                        <h1 className={styles.title}>{props.title}</h1>
                        <h2 className={styles.desc}>{props.desc}</h2>
                        <CardMedia 
                        sx={{maxHeight:"700px"}}
                        component="img"
                        image={props.img}
                        alt={props.alt}
                        />
                        <p className={styles["date-views"]}>{new Date(props.date).toLocaleString("th-TH", {day:"numeric", month:"long", year:"numeric"})}</p>
                        {props.views && 
                        <p className={styles["date-views"]}>เข้าชม {props.views} ครั้ง</p>
                        }
                        <hr />
                        <div className={styles["padding-bottom"]} dangerouslySetInnerHTML={{ __html: props.markdown }} />
                    </section>
                </Card>
                <div className={styles.author}>
                    <p>ผู้เขียน:</p><h3><Link href="/aboutme">Kiart Tantasi (เพชร)</Link></h3>
                    <br/><br/>
                    <p>GitHub:</p><a href="https://github.com/kiart-tantasi" target="_blank" rel="noopener noreferrer"><h3>kiart-tantasi</h3></a>
                </div>
            </article>
        </>
    )
}