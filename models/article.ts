export type Article = {
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

export type ArticleTypes = "" | "tech" | "gaming" | "workoutandhealth"| "others";

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
    token: string;
}

export type ArticleForm = {
    handleRequest: (article: FormData) => Promise<boolean>;
    article?: Article;
}