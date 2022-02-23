import { NextPage } from "next";
import AboutMePage from "../components/ฺBlog/AboutMePage";

const AboutMe:NextPage<{markdown:string; img: string; alt:string;}> = (props) => {
    return <AboutMePage markdown={props.markdown} img={props.img} alt={props.alt} />
}

export default AboutMe;
//-----------------------//
import { MongoClient } from "mongodb";

export async function getStaticProps() {
    const dbUrl = process.env.DB_URL as string;
    const client = new MongoClient(dbUrl);

    await client.connect();
    const db = client.db("blogDB");
    const collection = db.collection("bio");
    const bio = await collection.findOne({});
    const { markdown, img, alt } = bio!;
    client.close();
    
    return {
        props: {
            markdown,
            img,
            alt
        },
        revalidate: 20
    }
}

