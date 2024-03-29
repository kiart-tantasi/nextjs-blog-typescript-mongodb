import { Lexer, Parser } from 'marked'
import { NextPage } from 'next'

import AboutMePage from '../components/blog/AboutMePage'

const AboutMe: NextPage = () => {
    const lexed = Lexer.lex(bioMarkdown)
    const parsed = Parser.parse(lexed)
    return <AboutMePage markdown={parsed} />
}

export default AboutMe

export const bioMarkdown = `
KIART TANTASI
==========

<br>

ประวัติผู้เขียน
---------

&nbsp; &nbsp; &nbsp; &nbsp; สวัสดีครับ ผมชื่อเพชรนะครับ เป็นที่มาของชื่อเว็บไซต์นี้ ผมเป็นคนที่คิดนามแฝงไม่เก่ง เวลาตั้งชื่อในเกมหรือเว็บไซต์ต่าง ๆ ก็จะตั้งด้วยชื่อจริง นามสกุล หรือชื่อเล่นไปเลย ฮ่า ๆ ในหน้าประวัติผู้เขียนนี้ผมจะมาเล่าชีวิตของผมในด้านไอที โปรแกรมเมอร์ หรือ เดฟ นะครับ

ปัจจุบัน
------
&nbsp; &nbsp; &nbsp; &nbsp; ปัจจุบันผมกำลังฝึกในด้าน โปรแกรมมิ่ง Software Development หรือ Software Engineering (สิ่งที่ผมทำหลัก ๆ ก็คือการ code เพื่อสร้าง - พัฒนาซอฟต์แวร์ โปรแกรม แอปพลิเคชั่น เว็บไซต์) และแน่นอนปัจจุบันผมนั้นว่างงาน ฮ่า ๆ

<br>
<br>

&nbsp; &nbsp; &nbsp; &nbsp; แต่ด้วยความโชคดีในตอนเรียนจบ (ผมเพิ่งเรียนจบปี 2564 นะครับ) ผมได้โอกาสไปทำงานเก็บเงินโครงการ Work and Travel ที่ประเทศอเมริกา ทำให้พอมีเงินเก็บประทังชีวิตไปได้บ้าง (แต่ก็ต้องประหยัดเอานะครับ ฮ่า ๆ เงินเหลือน้อยนิดเต็มที)

ช่วงว่างงาน
---------
&nbsp; &nbsp; &nbsp; &nbsp; ถึงจะว่างงาน แต่จริง ๆ ตัวก็ไม่ว่างเลยครับ ผมใช้เวลาส่วนมากไปกับการศึกษา Frameworks Libraries Data Structure และ Algorithms เพิ่มเติมคือจะมีเล่นเกม League of Legends หรือ Dead by Daylight ทุก ๆ วันหลังฝึกเสร็จ

ไม่ได้จบวิทย์คอม ไอที วิศวะคอม
---------
&nbsp; &nbsp; &nbsp; &nbsp; ผมไม่ได้จบเอกวิทย์คอม ไอที หรือ วิศวะคอมพิวเตอร์ วิศวะซอฟต์แวร์ ใด ๆ มานะครับ ผมจบเอกภาษาอังกฤษ(ศิลปศาสตรบัณฑิต) ในช่วงปี 4 ที่เป็นช่วงโควิดระบาด ทำให้ผมต้องเรียนออนไลน์อยู่บ้านทั้งวัน และมีเวลาว่างเพิ่มขึ้นมาก ผมจึงตัดสินใจเริ่มศึกษาการโค้ดดู

<br>
<br>

&nbsp; &nbsp; &nbsp; &nbsp; ผมศึกษาการ Code ในทางสื่อออนไลน์ต่าง ๆ ไม่ว่าจะเป็น Youtube Google เว็บบล็อก บทความออนไลน์ หรือเว็บที่ต้องเสียตังอย่าง Udemy (แต่แอบไม่แพงนะ คอร์สละ 300 - 400 บาท ส่วนตัวผมว่าคุ้มมาก แต่ต้องฟังภาษาอังกฤษออก หรืออ่านซับภาษาอังกฤษได้ครับ)

จุดเริ่มต้นการ Coding
---------
&nbsp; &nbsp; &nbsp; &nbsp; ต้องบอกก่อนนะครับผมไม่ได้เริ่มใหม่จากศูนย์เลย เพราะผมเคยเขียน Script เกม Gta San Andreas มาก่อน ทำให้การเรียน Coding ของผมในช่วงปี 4 เป็นไปได้อย่างรวดเร็ว ตอน ป.6 ก่อนเข้า ม.1 ผมได้ไปเล่นเกม GTA San Andreas ในเซิร์ฟของคนอื่น (เป็นเซิร์ฟเถื่อนด้วย ฮ่า ๆ ตอนนี้ไถ่บาปด้วยการซื้อเกมแท้ละครับ)

<br>
<br>

&nbsp; &nbsp; &nbsp; &nbsp; เล่นไปเล่นมาผมก็รู้สึกอยากมีเซิร์ฟเป็นของตัวเอง ก็เลยได้ลองศึกษาการสร้างเซิร์ฟ Gta San Andreas ตาม Google และ Youtube และพบว่าการจะเป็นเจ้าของเซิร์ฟ Gta ได้ เราต้องสามารถเขียน Script ได้ครับ แต่ก็ไม่ได้เขียนจากไฟล์ว่าง ๆ นะครับ จะมีไฟล์สำเร็จรูปมาอยู่แล้ว ผมก็มาคอนฟิก ปรับแต่ง และสร้างระบบที่ผมอยากได้เข้าไป

การเขียนสคริปต์ Gta San Andreas
---------

&nbsp; &nbsp; &nbsp; &nbsp; การเขียนสคริปต์สร้างระบบฟีเจอร์เข้าไปในเกมนี้แหละครับ เป็นสิ่งที่ผมชอบมาก ทำให้ผมรู้สึกเหมือนเป็นเจ้าของโลกใบหนึ่ง เราสามารถกำหนดทุกสิ่งทุกอย่างได้ ทำให้ตอนนั้นผมไม่ได้คิดเลยว่าผมกำลังโค้ดอยู่ แต่กลับคิดว่าตัวเองกำลังควบคุมโลกอยู่ ฮ่า ๆ

<br>
<br>

&nbsp; &nbsp; &nbsp; &nbsp; ผมใช้เวลาไปกับการเขียนสคริปต์เกม GTA ประมาณ 3 - 4 เดือน ซึ่งตอนนั้นเป็นช่วงปิดเทอม ผมเขียนโค้ดไปประมาณสามถึงสี่หมื่นบรรทัดได้ แน่นอนว่าตอนนั้นยังไม่รู้จักหลักการ Clean Code หรือ Less Code เขียนมั่ว ๆ ตามภาษาเด็กอย่างเดียวเลยครับ ฮ่า ๆ
<br>
<br>

GitHub: <a href="https://github.com/kiart-tantasi" target="_blank" rel="noopener noreferrer">kiart-tantasi</a>
-----

<br>

Source Code: <a href="https://github.com/kiart-tantasi/nextjs-blog-typescript-mongodb" target="_blank" rel="noopener noreferrer">nextjs-blog-typescript-mongodb</a>
-------
`
