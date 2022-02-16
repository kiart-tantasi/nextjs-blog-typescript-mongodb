import type { NextPage } from 'next';
import BlogPage from "../components/ฺBlog/BlogPage";
import { TECH_DUMMY_DATA } from '../components/Articles/dummy-data';

const Tech: NextPage = () => {
    return <BlogPage articles={TECH_DUMMY_DATA} heading="ยินดีต้อนรับสู่โลกเทค!" />
}

export default Tech;