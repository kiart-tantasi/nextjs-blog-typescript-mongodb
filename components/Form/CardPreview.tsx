import { ArticleTypes, PreviewData } from "../../interfaces/article";
import CardUI from "../UI/CardUI";

const CardPreview = (props:{previewData: PreviewData; category: ArticleTypes; slug: string}) => {

    return (
        <>
        <hr style={{marginBottom:"50px"}} />
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
        <div style={{marginBottom:"100px"}} />
        </>
    )
} 

export default CardPreview;
