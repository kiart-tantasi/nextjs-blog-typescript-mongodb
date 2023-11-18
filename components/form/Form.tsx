import Button from '@mui/material/Button'
import { Lexer, Parser } from 'marked'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import { Article, PreviewData } from '../../interfaces/article'
import ArticlePreview from './ArticlePreview'
import CardPreview from './CardPreview'
import styles from './Form.module.css'

const ArticleForm = (props: { article?: Article; editMode: boolean }) => {
    const router = useRouter()
    const { editMode } = props
    // FORM
    const titleRef = useRef<HTMLInputElement>(null)
    const imgRef = useRef<HTMLInputElement>(null)
    const altRef = useRef<HTMLInputElement>(null)
    const descRef = useRef<HTMLInputElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    // PREVIEW
    const [preview, setPreview] = useState(false)
    const [previewData, setPreviewData] = useState<PreviewData>({} as PreviewData)

    useEffect(() => {
        if (!props.article) return
        if (!editMode) return
        const article = props.article
        titleRef.current!.value = article!.title
        imgRef.current!.value = article!.img
        altRef.current!.value = article!.alt
        descRef.current!.value = article!.desc
        textAreaRef.current!.value = article!.markdown
    }, [props.article, editMode])

    const handlePreview = async () => {
        const lexed = Lexer.lex(textAreaRef.current?.value || 'ไม่มี markdown')
        const parsed = Parser.parse(lexed)
        const response = await fetch('/api/v1/presigned-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imgUrl: imgRef.current?.value || null }),
        })
        const data = await response.json()
        const { imgUrl } = data
        const dataToSet: PreviewData = {
            title: titleRef.current?.value || 'ไม่มีหัวข้อ',
            img: imgUrl || 'not found',
            alt: altRef.current?.value || 'ไม่มี alt รูปภาพ',
            desc: descRef.current?.value || 'ไม่มีคำอธิบายบทความ',
            markdown: parsed,
            date: Date.now(),
            views: 100,
        }
        setPreviewData(dataToSet)
        if (preview === false) setPreview(true)
    }

    const handleSubmitEditArticle = async (e: React.FormEvent) => {
        e.preventDefault()
        const title = titleRef.current!.value
        const img = imgRef.current!.value
        const alt = altRef.current!.value
        const desc = descRef.current!.value
        const markdown = textAreaRef.current!.value
        const category = props.article!.category
        const slug = props.article!.slug
        if (!title.length || !img.length || !alt.length || !desc.length || !markdown.length)
            return alert('ข้อมูลไม่ครบถ้วน')
        if (!category.length || !slug.length) return alert('ไม่พบ หมวดหมู่ หรือ slug')

        const sendingData = {
            title: title,
            img: img,
            alt: alt,
            desc: desc,
            markdown: markdown,
            category: category,
            slug: slug,
        }
        const response = await fetch('/api/v1/articles', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendingData),
        })

        if (response.status === 401) return alert('session admin หมดอายุ')
        if (!response.ok) return alert('แก้ไขบทความล้มเหลว !')

        alert(
            props.article!.category === 'workspace'
                ? 'แก้ไขบทความสำเร็จ (workspace)'
                : 'แก้ไขบทความสำเร็จ - แอปพลิเคชั่นจะใช้เวลาประมาณ 10 วินาทีเพื่อ render หน้าบทความใหม่',
        )
        const linkToPushTo =
            props.article!.category === 'workspace'
                ? '/workspace/' + props.article!.slug
                : '/article/' + props.article!.slug
        router.push(linkToPushTo)
    }

    const handleSubmitNewArticle = async (e: React.FormEvent) => {
        e.preventDefault()
        const title = titleRef.current!.value
        const img = imgRef.current!.value
        const alt = altRef.current!.value
        const desc = descRef.current!.value
        const markdown = textAreaRef.current!.value
        if (!title.length || !img.length || !alt.length || !desc.length || !markdown.length) {
            return alert('ข้อมูลไม่ครบถ้วน')
        }
        const sendingData = {
            title: title,
            img: img,
            alt: alt,
            desc: desc,
            markdown: markdown,
            postToPublic: false,
        }
        const response = await fetch('/api/v1/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendingData),
        })

        if (response.status === 401) return alert('session แอดมินหมดอายุ')
        else if (!response.ok) return alert('เพิ่มบทความล้มเหลว !')

        alert('เพิ่มบทความสำเร็จ')
        titleRef.current!.value = ''
        imgRef.current!.value = ''
        altRef.current!.value = ''
        descRef.current!.value = ''
        textAreaRef.current!.value = ''
        router.push('/workspace')
    }

    return (
        <>
            <div className={styles['nav-top']}>
                <Button type='button' onClick={() => router.back()}>
                    กลับ
                </Button>
            </div>
            <div className={`${styles['form-container']} row`}>
                <h1 className={styles.heading}>{editMode ? 'แก้ไขบทความ' : 'เพิ่มบทความใหม่'}</h1>
                <form className={styles.form} onSubmit={editMode ? handleSubmitEditArticle : handleSubmitNewArticle}>
                    <div>
                        <label>หัวข้อ</label>
                        <input type='text' ref={titleRef} />
                    </div>

                    <div>
                        <label>url รูปภาพ</label>
                        <input type='text' ref={imgRef} />
                        <label>คำอธิบายรูปภาพ (กรณีไฟล์รูปหาย)</label>
                        <input className={styles['secondary-input']} type='text' ref={altRef} />
                    </div>

                    <div>
                        <label>คำอธิบายบทความ</label>
                        <input className={styles.desc} type='text' ref={descRef} />
                    </div>

                    <button type='button' className={styles['preview-button']} onClick={handlePreview}>
                        {preview ? 'รีเฟรช' : 'ดูตัวอย่าง'}
                    </button>

                    <div className={styles['edit-preview']}>
                        <div className={styles.edit}>
                            <br />
                            <h3>เนื้อหาบทความ</h3>
                            <textarea ref={textAreaRef} />
                        </div>
                        {preview && (
                            <div className={styles.preview}>
                                <ArticlePreview previewData={previewData} />
                            </div>
                        )}
                    </div>

                    <button type='submit' className={styles['submit-button']}>
                        {editMode ? 'แก้ไขบทความ' : 'เพิ่มบทความใหม่ไปยัง WORKSPACE'}
                    </button>
                </form>
            </div>

            {preview && (
                <div className={styles['card-preview']}>
                    <CardPreview
                        previewData={previewData}
                        category={editMode ? props.article!.category : 'workspace'}
                        slug={editMode ? props.article!.slug : 'no-sample-here'}
                    />
                </div>
            )}
        </>
    )
}

export default ArticleForm
