import '../styles/globals.css';

import type { AppProps } from 'next/app';
import Head from "next/head";
import Layout from '../components/Layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>เพชร The Blog</title>
        <meta name="description" content="เพชร's Perosnal Blog รวบรวมเนื้อหา เทคโนโลยี ศิลปะ ความชอบ การท่องเที่ยว และภาษา" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
