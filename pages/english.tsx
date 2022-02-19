import Head from "next/head";
import BlogPage from "../components/ฺBlog/BlogPage";

const English = () => {
    return (
        <>
        <Head><title>เพชร The Blog - ภาษาอังกฤษ</title></Head>
        <BlogPage articles={[]} heading="Let's Learn English !" />
        </>
    )
}

export default English;