export type Article = {
    _id?: string;
    title: string;
    desc: string;
    markdown: string;
    img: string;
    alt: string;
    date : number;
    author?: string;
    category: ArticleTypes;
    slug: string;
    views?: number;
}
//category slug img alt title desc date

export type ArticleCard = {
    _id: string;
    title: string;
    desc: string;
    img: string;
    alt: string;
    date : number;
    category: ArticleTypes;
    slug: string;
}

export type ArticleTypes = "" | "tech" | "gaming" | "workoutandhealth"| "others" | "workspace";

export type FormData = {
    id?: string;
    title: string;
    desc: string;
    markdown: string;
    img: string;
    alt: string;
    date : number;
    author?: string;
    category: ArticleTypes;
    slug: string;
}

export type FindOneAndUpdateForm = {
    title: string;
    img: string;
    alt: string;
    desc: string;
    markdown: string;
}

export type ArticleForm = {
    handleRequest: (article: FormData) => Promise<boolean>;
    article?: Article;
}

export type PreviewDataInterface = {
    title:string; 
    desc:string; 
    img:string; 
    alt: string; 
    date:number; 
    views:number | undefined; 
    markdown:string
};