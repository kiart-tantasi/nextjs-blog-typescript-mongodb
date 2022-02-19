import Head from "next/head";
import BlogPage from "../components/ฺBlog/BlogPage";

const WorkoutAndHealth = () => {
    return (
        <>
        <Head><title>เพชร The Blog - ออกกำลังกาย สุขภาพ</title></Head>
        <BlogPage articles={[]} heading="LET'S WORK !" />
        </>
    )
}

export default WorkoutAndHealth;