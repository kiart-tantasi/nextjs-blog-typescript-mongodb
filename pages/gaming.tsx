import type { NextPage } from 'next';
import BlogPage from '../components/ฺBlog/BlogPage';
import { GAMING_DUMMY_DATA } from '../components/Articles/dummy-data';

const Gaming: NextPage = () => {
    return <BlogPage articles={GAMING_DUMMY_DATA} heading="ยินดีต้อนรับสู่ดินแดนเกมมิ่ง!" />
}

export default Gaming;