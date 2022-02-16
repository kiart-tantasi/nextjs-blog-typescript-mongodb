import NewArticlePage from "../components/ฺBlog/NewArticlePage";
import { useRouter } from "next/router";
import { Article } from "../models/article";

const NewArticle = () => {
    const router = useRouter();

    const handleAddNewArticle = (article: Article) => {

        const sendRequest = async() => {
            const response = await fetch("/api/new-article", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(article)
            });
            if (!response.ok) {
                alert("adding new article failed");
            } else {
                alert("posted new article successfully.");
            }

        }
        sendRequest();
    }

    return <NewArticlePage handleAddNewArticle={handleAddNewArticle} />
}

export default NewArticle;