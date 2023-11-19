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

export enum Status {
    WORKSPACE = "WORKSPACE",
    BIN = "BIN",
    PUBLIC = "PUBLIC",
}

export interface V2Insert {
    title: string
    desc: string
    markdown: string
    img: string
    alt: string
    date: number
    slug: string
    views: number
    status: Status
    records: any[] // TODO: stop using any
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

export interface V2ToPublic {
    slug: string
    category: string
    date: number
    status: Status
}

// when moving to bin, we need to keep track of previous status so we can recover it into correct status (endpoint /api/v2/recover-article)
export interface V2ToBin {
    status: Status
    prevStatus: Status
}
