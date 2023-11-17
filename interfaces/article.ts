export type Article = {
    _id?: string
    title: string
    desc: string
    markdown: string
    img: string
    alt: string
    date: number
    author?: string
    category: ArticleTypes
    slug: string
    views?: number
    record?: Article[]
}

export type ArticleCard = {
    index?: number
    _id: string
    title: string
    desc: string
    img: string
    alt: string
    date: number
    category: ArticleTypes
    slug: string
}

export type ArticleTypes = '' | 'tech' | 'gaming' | 'workoutandhealth' | 'others' | 'workspace'

export type PreviewData = {
    title: string
    desc: string
    img: string
    alt: string
    date: number
    views: number | undefined
    markdown: string
}

export type FindOldVersionForm = {
    id: string
    title: string
    desc: string
    markdown: string
    img: string
    alt: string
    date: number
    category: ArticleTypes
    slug: string
    views: number
    editDate: number
}

export type setDataForm = {
    title: string
    img: string
    alt: string
    desc: string
    markdown: string
    record?: any[]
}

export type SetDataFormV2 = {
    title: string
    img: string
    alt: string
    desc: string
    markdown: string
    records: any[] // TODO: stop using any
}
