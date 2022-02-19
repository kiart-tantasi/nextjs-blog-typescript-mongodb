import { Article } from "../models/article";
import { Lexer, Parser } from "marked";

export const DUMMY_DATA: Article[] = [
    { title: "First Post", desc: "This is my first post.", markdown:" This is some markdown.", img:"https://images.contentstack.io/v3/assets/blt370612131b6e0756/blta1d3d18c029012e8/60107b5b3e567f1011da3594/Teemo_TurnTable_img.jpg", alt:"Teemo", slugged: Math.random().toString(), category: "others", date:1645015239154 },
    { title: "Second Post", desc: "This is my second post.", markdown:" This is some markdown.", img:"", alt:"no img", slugged: Math.random().toString(), category: "others", date:1645015239154 },
    { title: "Third Post", desc: "This is my third post.", markdown:" This is some markdown.", img:"", alt:"no img", slugged: Math.random().toString(), category: "others", date:1645015239154 },
];

export const TECH_DUMMY_DATA: Article[] = [
    { title: "MERN STACK", desc: "the easiest full stack ever", markdown:"This is some markdown.", img: "https://miro.medium.com/max/1400/1*k0SazfSJ-tPSBbt2WDYIyw.png", alt:"mern stack", slugged: Math.random().toString(), category: "others", date:1645015239154 },
    { title: "เปอร์เซ็นต์คนลาออกจากวงการ IT", desc: "อัตราส่วนของผู้ลาออกจากงานสายไอทีในหมวดย่อยต่าง ๆ", markdown:" This is some markdown.", img:"https://devskiller.com/wp-content/uploads/2020/03/pasted-image-0.png", alt:"it job turnover rate", slugged: Math.random().toString(), category: "others", date:1645015239154 },
]

export const GAMING_DUMMY_DATA: Article[] = [
    { title: "มาติดเกมไปด้วยกัน", desc: "ไม่ถนัดแบก ถนัดแจกมากกว่า", markdown:"This is some markdown.", img:"https://i.ytimg.com/vi/rfzrHeRbvYM/maxresdefault.jpg", alt:"Yasuo is the feeder.", slugged: Math.random().toString(), category: "others", date:1645015239154 },
    { title: "ดินแดน ARAM แห่ง Leauge of Legends", desc: "สะพานน้ำแข็ง !", markdown:"This is some markdown.", img:"https://img.redbull.com/images/q_auto,f_auto/redbullcom/2017/05/05/1331856442274_3/all-random-all-mid-%E0%B8%95%E0%B8%A5%E0%B8%AD%E0%B8%94%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2.jpg", alt:"Howling Abyss of ARAM, League of Legends", slugged: Math.random().toString(), category: "others", date:1645015239154 },
]

export const oldArticleOnMongoDb: Article[] = [
    { id: "620cf0289b909b85e59386e2", title : "มาเรียนวิธีการ Merge Sort ด้วย JavaScript กัน!", img : "https://atomiclotus.net/wp-content/uploads/2020/03/merge-sort.png", desc : "วิธีการ Merge Sort ด้วยภาษา JavaScript ด้วย BigO n log n", markdown : "Merge Sort ถือเป็นวิธีการ sort ข้อมูลที่เร็วที่สุด ณ ปัจจุบัน หรือมีความเร็วเป็น n log n หากคิดตามหลัก time complexity หรือ Big O Notation", alt : "merge sort", date : 1645015080379, slugged: Math.random().toString(), category: "others" },
    { id: "620cf0c79b909b85e59386e3", title : "MERN STACK", img : "https://miro.medium.com/max/1400/1*k0SazfSJ-tPSBbt2WDYIyw.png", desc : "the easiest full stack ever", markdown : "This is some markdown.", alt : "mern stack", date : 1645015239154, slugged: Math.random().toString(), category: "others" },
    { id: "620cf2509b909b85e59386e4", title : "ดินแดน ARAM แห่ง Leauge of Legends", img : "https://img.redbull.com/images/q_auto,f_auto/redbullcom/2017/05/05/1331856442274_3/all-random-all-mid-%E0%B8%95%E0%B8%A5%E0%B8%AD%E0%B8%94%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2.jpg", desc : "สะพานน้ำแข็ง !", markdown : "This is some markdown.", alt : "Howling Abyss of ARAM, League of Legends", date : 1645015632295, slugged: Math.random().toString(), category: "others" },
    { id: "620dbe7faf3b44904ef50930", title : "เทา", img : "https://i.ytimg.com/vi/L2ZxBtC9DjQ/maxresdefault.jpg", desc : "เทส", markdown : "Marked - Markdown Parser\n========================\n\n[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.\n\nHow To Use The Demo\n-------------------\n\n1. Type in stuff on the left.\n2. See the live updates on the right.", alt : "หมาตลก", date : 1645067903890, slugged: Math.random().toString(), category: "others" },
    { id: "620dbed5af3b44904ef50931", title : "เทส", img : "https://i.picsum.photos/id/995/200/300.jpg?hmac=eFU8vnJxVDadyN4EfO1gKTmd6m9u3C-jglYq9Gi34ew", desc : "เทสๆๆ", markdown : "Marked - Markdown Parser\n========================\n\n[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.\n\nHow To Use The Demo\n-------------------\n\n1. Type in stuff on the left.\n2. See the live updates on the right.\n\nThat's it.  Pretty simple.  There's also a drop-down option in the upper right to switch between various views:\n\n- **Preview:**  A live display of the generated HTML as it would render in a browser.\n- **HTML Source:**  The generated HTML before your browser makes it pretty.\n- **Lexer Data:**  What [marked] uses internally, in case you like gory stuff like this.\n- **Quick Reference:**  A brief run-down of how to format things using markdown.\n\nWhy Markdown?\n-------------\n\nIt's easy.  It's not overly bloated, unlike HTML.  Also, as the creator of [markdown] says,\n\n> The overriding design goal for Markdown's\n> formatting syntax is to make it as readable\n> as possible. The idea is that a\n> Markdown-formatted document should be\n> publishable as-is, as plain text, without\n> looking like it's been marked up with tags\n> or formatting instructions.\n\nReady to start writing?  Either start changing stuff on the left or\n[clear everything](/demo/?text=) with a simple click.\n\n[Marked]: https://github.com/markedjs/marked/\n[Markdown]: http://daringfireball.net/projects/markdown/\n", alt : "random pic", date : 1645067989484, slugged: Math.random().toString(), category: "others" },
    { id: "62104434a4d809d798fb9589", title : "เมินแสต๋ก", img : "https://miro.medium.com/max/1400/1*k0SazfSJ-tPSBbt2WDYIyw.png", desc : "dasdas", markdown : "เนื้อหาบทความๆๆๆๆๆๆๆ", alt : "MERN", date : 1645233204103, slugged: Math.random().toString(), category: "others" }
]

const markdownDemoText = `Marked - Markdown Parser
========================

[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.

How To Use The Demo
-------------------

1. Type in stuff on the left.
2. See the live updates on the right.

That's it.  Pretty simple.  There's also a drop-down option in the upper right to switch between various views:

- **Preview:**  A live display of the generated HTML as it would render in a browser.
- **HTML Source:**  The generated HTML before your browser makes it pretty.
- **Lexer Data:**  What [marked] uses internally, in case you like gory stuff like this.
- **Quick Reference:**  A brief run-down of how to format things using markdown.

Why Markdown?
-------------

It's easy.  It's not overly bloated, unlike HTML.  Also, as the creator of [markdown] says,

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

Ready to start writing?  Either start changing stuff on the left or
[clear everything](/demo/?text=) with a simple click.

[Marked]: https://github.com/markedjs/marked/
[Markdown]: http://daringfireball.net/projects/markdown/`;

const lexed = Lexer.lex(markdownDemoText);

export const parsedByMarked = Parser.parse(lexed);