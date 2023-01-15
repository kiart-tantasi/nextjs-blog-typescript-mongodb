import { ArticleTypes, PreviewData } from '../../interfaces/article'
import CardUI from '../ui/CardUI'

const CardPreview = (props: { previewData: PreviewData; category: ArticleTypes; slug: string }) => {
    const articleCardData = {
        index: 0,
        _id: Math.random().toString(),
        title: props.previewData.title,
        desc: props.previewData.desc,
        date: props.previewData.date,
        img: props.previewData.img,
        alt: props.previewData.alt,
        slug: props.slug,
        category: props.category,
    }

    return (
        <>
            <hr style={{ marginBottom: '50px' }} />
            <CardUI articleCard={articleCardData} />
            <div style={{ marginBottom: '100px' }} />
        </>
    )
}

export default CardPreview
