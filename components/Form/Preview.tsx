import { ArticleTypes, PreviewDataInterface } from "../../interfaces/article";
import ArticleCardUI from "../UI/ArticleCardUI";
import CardUI from "../UI/CardUI";

const Preview = (props:{previewData:PreviewDataInterface; category: ArticleTypes; slug: string}) => {

    return (
        <>
        <hr style={{marginBottom:"35px"}}/>
        <CardUI 
        _id={Math.random().toString()}
        title={props.previewData.title}
        img={props.previewData.img}
        alt={props.previewData.alt}
        desc={props.previewData.desc}
        date={props.previewData.date}
        category={props.category}
        slug={props.slug}
        />
        <hr />
        <ArticleCardUI
        title={props.previewData.title}
        img={props.previewData.img}
        alt={props.previewData.alt}
        desc={props.previewData.desc}
        markdown={props.previewData.markdown}
        date={props.previewData.date}
        views={props.previewData.views}
        />
        </>
    )
} 

export default Preview;
