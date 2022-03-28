import { PreviewData } from "../../interfaces/article";
import ArticleUI from "../ui/ArticleUI";

const ArticlePreview = (props:{previewData: PreviewData;}) => {
    return (
        <ArticleUI
        title={props.previewData.title}
        img={props.previewData.img}
        alt={props.previewData.alt}
        desc={props.previewData.desc}
        markdown={props.previewData.markdown}
        date={props.previewData.date}
        views={props.previewData.views}
        />
    )
} 

export default ArticlePreview;
