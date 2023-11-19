import { Button } from '@mui/material'
import { useRef } from 'react'
import slugify from 'slugify'

import { Article } from '../../interfaces/article'
import styles from './PostToPublicModalUI.module.css'
import { allowedCategoriesV1 } from '../../config'

const PostToPublicModalUI = (props: { article: Article; onClose: () => void; replaceWithHome: () => void }) => {
    const selectRef = useRef<HTMLSelectElement>(null)
    const slugRef = useRef<HTMLInputElement>(null)

    const handlePostToPublic = async () => {
        const slugValue = slugRef.current!.value
        const slug = slugify(slugValue)
        if (!slug.length) {
            return alert('slug ไม่ถูกต้อง')
        }
        const category = selectRef.current!.value
        if (!allowedCategoriesV1.includes(category) || category === 'workspace') {
            return alert('หมวดหมู่ไม่ถูกต้อง')
        }
        const sendingData = {
            category: category,
            slug: slug,
            workspaceSlug: props.article.slug,
            postToPublic: true,
        }
        const response = await fetch('/api/v1/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendingData),
        })
        if (response.ok) {
            alert('โพสต์ไปยัง PUBLIC สำเร็จ')
            props.onClose()
            props.replaceWithHome()
        } else {
            const data = await response.json()
            alert('ล้มเหลว: ' + data.message)
        }
    }

    return (
        <>
            <div onClick={() => props.onClose()} className={styles.modalBackdrop} />
            <div className={styles.modal}>
                <div className={styles['modal-content']}>
                    <p>ต้องการโพสต์บทความไปที่ Public</p>
                    <label>slug</label>
                    <input type='text' ref={slugRef} />
                    <label>หมวดหมู่</label>
                    <select name='category' ref={selectRef}>
                        <option value=''>เลือก</option>
                        <option value='tech'>เทค</option>
                        <option value='gaming'>เกมมิ่ง</option>
                        <option value='workoutandhealth'>ออกกำลังกายและสุขภาพ</option>
                        <option value='others'>อื่น ๆ </option>
                    </select>
                </div>
                <div className={styles.buttons}>
                    <Button onClick={props.onClose}>ยกเลิก</Button>
                    <Button color='success' onClick={handlePostToPublic}>
                        ยืนยัน
                    </Button>
                </div>
            </div>
        </>
    )
}

export default PostToPublicModalUI
