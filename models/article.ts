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
    slugged: string;
}

export type ArticleTypes = "" | "tech" | "gaming" | "english" | "workoutandhealth"| "others";