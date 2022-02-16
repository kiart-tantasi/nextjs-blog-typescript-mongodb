import ArticleDetail from "../../components/Articles/ArticleDetail";

const ArticlePage = (props:{title:string; desc: string; markdown: string;}) => {
    
    if (!props.title) {
        return <div><h1>NOT FOUND</h1></div>
    }

    return (
        <ArticleDetail title={props.title} desc={props.desc} markdown={props.markdown} />
    )
}

export default ArticlePage;