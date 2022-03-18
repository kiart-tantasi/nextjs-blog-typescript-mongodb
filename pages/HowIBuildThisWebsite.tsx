import { NextPage } from "next";
import Head from "next/head";
import HowIBuildThisWebsitePage from "../components/blog/HowIBuildThisWebsitePage";

const HowIBuildThisWebsite: NextPage = () => {
    return (
        <>
        <Head>
            <title>How I Build This Website</title>
            <meta name="description" content="All Tech Stacks That I use in This Website" />

        </Head>
        <HowIBuildThisWebsitePage/>
        </>
    )
}

export default HowIBuildThisWebsite;