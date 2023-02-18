import { GetStaticProps } from "next";

interface PageProps { date: string }

export default function Page({ date }: PageProps) {
    return (
        <div>
            <h1>data from server (SSG)</h1>
            <h2>{date}</h2>
        </div>
    )
}

export async function getStaticProps(): Promise<{ props: PageProps }> {
    return {
        props: {
            date: new Date().toString()
        }
    }
}
