import { Button } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import AuthContext from '../../context/auth-context'
import { ArticleCard } from '../../interfaces/article'
import Articles from '../blog/Articles'
import styles from './AdminPage.module.css'

const AdminPage = (props: { articles: ArticleCard[] }) => {
    const router = useRouter()
    const AuthCtx = useContext(AuthContext)
    const { logOut } = AuthCtx

    const handleLogOut = async () => {
        const response = await fetch('/api/logout-admin', { method: 'POST' })
        if (!response.ok) {
            alert('session แอดมินหมดอายุก่อนออกจากระบบ')
        } else {
            alert('ออกจากระบบสำเร็จ')
        }
        logOut()
        router.replace('/workspace')
    }

    return (
        <>
            <Head>
                <title>WORKSPACE</title>
            </Head>
            <div className={styles['nav-top']}>
                <div className={styles['flex-container']}>
                    <div className={styles['flex-left']}>
                        <Button>
                            <Link href='/workspace/new-article'>เพิ่มบทความใหม่</Link>
                        </Button>
                        <Button color='warning'>
                            <Link href='/workspace/bin'>บทความที่ถูกลบ</Link>
                        </Button>
                    </div>
                    <div className={styles['flex-right']}>
                        <Button onClick={handleLogOut}>ออกจากระบบ</Button>
                    </div>
                </div>
            </div>
            <Articles articles={props.articles} />
        </>
    )
}

export default AdminPage
