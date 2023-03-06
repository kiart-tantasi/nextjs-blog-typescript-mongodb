import type { AppProps } from 'next/app'
import Head from 'next/head'

import Layout from '../components/layout/Layout'
import { AuthContextProvider } from '../context/auth-context'
import '../styles/globals.css'
import { websiteNameEnglish, websiteNameLocal } from '../utils/sharedData'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthContextProvider>
            <Layout>
                <Head>
                    <title>{`${websiteNameEnglish} | ${websiteNameLocal}`}</title>
                    <meta
                        name='description'
                        content={`${websiteNameLocal} - บทความ เทคโนโลยี สอนเขียนโค้ด สอนสร้างแอปพลิเคชั่นและเว็บไซต์ รวมถึงบทความเกม บทความออกกำลังกาย บทความสุขภาพ และ แบ่งปันเรื่องราวในชีวิต`}
                    />
                    <link rel='shortcut icon' href='/images/favicon.ico' />
                </Head>
                <Component {...pageProps} />
            </Layout>
        </AuthContextProvider>
    )
}

export default MyApp
