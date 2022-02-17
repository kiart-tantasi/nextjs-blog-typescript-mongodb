import { Article } from "../models/article";

export const DUMMY_DATA: Article[] = [
    { title: "First Post", desc: "This is my first post.", markdown:" This is some markdown.", img:"https://images.contentstack.io/v3/assets/blt370612131b6e0756/blta1d3d18c029012e8/60107b5b3e567f1011da3594/Teemo_TurnTable_img.jpg", alt:"Teemo"},
    { title: "Second Post", desc: "This is my second post.", markdown:" This is some markdown.", img:"", alt:"no img"},
    { title: "Third Post", desc: "This is my third post.", markdown:" This is some markdown.", img:"", alt:"no img"},
];

export const TECH_DUMMY_DATA: Article[] = [
    { title: "MERN STACK", desc: "the easiest full stack ever", markdown:"This is some markdown.", img: "https://miro.medium.com/max/1400/1*k0SazfSJ-tPSBbt2WDYIyw.png", alt:"mern stack"},
    { title: "เปอร์เซ็นต์คนลาออกจากวงการ IT", desc: "อัตราส่วนของผู้ลาออกจากงานสายไอทีในหมวดย่อยต่าง ๆ", markdown:" This is some markdown.", img:"https://devskiller.com/wp-content/uploads/2020/03/pasted-image-0.png", alt:"it job turnover rate"},
]

export const GAMING_DUMMY_DATA: Article[] = [
    { title: "มาติดเกมไปด้วยกัน", desc: "ไม่ถนัดแบก ถนัดแจกมากกว่า", markdown:"This is some markdown.", img:"https://i.ytimg.com/vi/rfzrHeRbvYM/maxresdefault.jpg", alt:"Yasuo is the feeder."},
    { title: "ดินแดน ARAM แห่ง Leauge of Legends", desc: "สะพานน้ำแข็ง !", markdown:"This is some markdown.", img:"https://img.redbull.com/images/q_auto,f_auto/redbullcom/2017/05/05/1331856442274_3/all-random-all-mid-%E0%B8%95%E0%B8%A5%E0%B8%AD%E0%B8%94%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2.jpg", alt:"Howling Abyss of ARAM, League of Legends"},
]