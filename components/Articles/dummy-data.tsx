import { Article } from "../../models/article";

const DUMMY_DATA: Article[] = [
    { title: "First Post", desc: "This is my first post.", markdown:" This is some markdown."},
    { title: "Second Post", desc: "This is my second post.", markdown:" This is some markdown."},
    { title: "Third Post", desc: "This is my third post.", markdown:" This is some markdown."},
];
export default DUMMY_DATA;

export const TECH_DUMMY_DATA: Article[] = [
    { title: "Tech", desc: "เทค!", markdown:" This is some markdown."},
    { title: "Second Tech Post", desc: "ยินดีต้อนรับสู่ช่องเทค !", markdown:" This is some markdown."},
]

export const GAMING_DUMMY_DATA: Article[] = [
    { title: "Gaming", desc: "เกมมิ่ง!", markdown:" This is some markdown."},
    { title: "Second Gaming Post", desc: "ยินดีต้อนรับสู่ช่องเกมมิ่ง !", markdown:" This is some markdown."},
]