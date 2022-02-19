import ArticleDetail from "../components/ฺBlog/ArticleDetail";
import { Article } from "../models/article";

const dummyMarkdown = "เนื้อหาบทความเนื้อหาบทความเนื้อหาบทความ เนื้อหาบทความเนื้อหาบทความเนื้อหาบทความ เนื้อหาบทความเนื้อหาบทความเนื้อหาบทความ เนื้อหาบทความเนื้อหาบทความเนื้อหาบทความ เนื้อหาบทความเนื้อหาบทความเนื้อหาบทความ เนื้อหาบทความเนื้อหาบทความเนื้อหาบทความ เนื้อหาบทความเนื้อหาบทความเนื้อหาบทความ เนื้อหาบทความเนื้อหาบทความเนื้อหาบทความ"
const dummyImg = "https://i.ytimg.com/vi/L2ZxBtC9DjQ/maxresdefault.jpg";
const dummyDate = new Date().getTime();

const Article = () => {
    return <ArticleDetail title="หัวข้อบทความ" desc="คำอธิบายบทความ" img={dummyImg} alt="หมาน้อย" date={dummyDate} markdown={dummyMarkdown} category="others" slug="บทความ" />
}

export default Article;