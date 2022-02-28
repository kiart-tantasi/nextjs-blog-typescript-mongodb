import Head from "next/head";
import Articles from "../ฺBlog/Articles";
import { ArticleCard } from "../../interfaces/article";

const BinPage = (props:{articles: ArticleCard[]}) => {

    return (
        <>
        <Head><title>BIN</title></Head>
        <div>
            <h3 style={{textAlign:"center", margin: "30px 0"}}>บทความที่ถูกลบ ไม่สามารถเปิดดูได้ (404)</h3>
            <Articles articles={props.articles} />
        </div>
        </>
    )
}

export default BinPage;