import type { NextPage } from 'next';
import Head from 'next/head';
import BlogPage from '../components/ฺBlog/BlogPage';
import { GAMING_DUMMY_DATA } from '../utilities/dummy-data';

const Gaming: NextPage = () => {
    return (
        <>
        <Head><title>เพชร The Blog - เกมมิ่ง</title></Head>
        <BlogPage articles={GAMING_DUMMY_DATA} heading="ยินดีต้อนรับสู่โลกคนติดเกมส์!" />
        </>
    )
}

export default Gaming;