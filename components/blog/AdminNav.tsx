import Button from '@mui/material/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Article } from '../../interfaces/article'
import ModalUI from '../ui/ModalUI'
import PostToPublicModalUI from '../ui/PostToPublicModalUI'
import styles from './AdminNav.module.css'

const AdminNav = (props: Article) => {
    const router = useRouter()
    const [deleteModal, setDeleteModal] = useState(false)
    const [postPublicModal, setPostPublicModal] = useState(false)

    const handleDelete = async () => {
        const response = await fetch('/api/articles', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: props.slug, category: props.category, permanentDelete: false }),
        })
        if (response.ok) {
            setDeleteModal(false)
            alert('ลบบทความสำเร็จ')
            if (props.category === 'workspace') {
                router.replace('/workspace')
            } else {
                router.replace('/')
            }
        } else {
            setDeleteModal(false)
            alert('ลบบทความล้มเหลว')
        }
    }

    return (
        <>
            {deleteModal && (
                <ModalUI
                    text='โปรดพิมพ์ slug ของบทความนี้เพื่อยืนยันการลบ'
                    important
                    delete={{ delete: true, slug: props.slug }}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteModal(false)}
                />
            )}
            {postPublicModal && (
                <PostToPublicModalUI
                    article={props}
                    onClose={() => setPostPublicModal(false)}
                    replaceWithHome={() => router.replace('/')}
                />
            )}

            <div className={styles['nav-top']}>
                <Button onClick={() => router.back()}>กลับ</Button>
                {props.category === 'workspace' && (
                    <Button color='success' onClick={() => setPostPublicModal(true)}>
                        โพสต์ไปยัง public
                    </Button>
                )}
                <Button>
                    <Link href={'/workspace/edit/' + props.slug}>แก้ไข</Link>
                </Button>
                <Button color='error' onClick={() => setDeleteModal(true)}>
                    ลบ
                </Button>
            </div>
        </>
    )
}

export default AdminNav
