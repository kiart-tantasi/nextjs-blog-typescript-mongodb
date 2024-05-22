import { NextPage } from 'next'
import Head from 'next/head'

import WebsiteTechStackPage from '../components/blog/WebsiteTechStackPage'

const WebsiteTechStack: NextPage = () => {
    return (
        <>
            <Head>
                <title>How I Build This Website</title>
                <meta name='description' content='Tech Stack for website www.petchblog.net' />
            </Head>
            <WebsiteTechStackPage />
        </>
    )
}

export default WebsiteTechStackPage
