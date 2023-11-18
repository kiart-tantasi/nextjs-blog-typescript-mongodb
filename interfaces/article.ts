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

// ================== V2 ================== //

export interface V2Insert {
    title: string
    desc: string
    markdown: string
    img: string
    alt: string
    date: number
    slug: string
    views: number
    records: any[] // TODO: stop using any
    isWorkspace: boolean
    isBin: boolean
    // NOTE: there is no category at this moment
};

export interface V2Update {
    title: string
    img: string
    alt: string
    desc: string
    markdown: string
    records: any[] // TODO: stop using any
}

interface V2MovingBase {
    isWorkspace: boolean
    isBin: boolean
}

export interface V2PostToPublic extends V2MovingBase {
    slug: string
    category: string
    date: number
    isWorkspace: false
    isBin: false
}

export interface V2MoveToBin extends V2MovingBase {
    isWorkspace: false
    isBin: true
}
