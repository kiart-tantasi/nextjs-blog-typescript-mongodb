const ArticleDetail = (props:{title:string; desc: string; markdown:string;}) => {
    return (
        <div>
            <h1>{props.title}</h1>
            <p>{props.desc}</p>
            <p>{props.markdown}</p>
        </div>
    )
}

export default ArticleDetail;