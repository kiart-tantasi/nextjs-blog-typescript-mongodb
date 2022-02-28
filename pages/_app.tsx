import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from "next/head";
import Layout from '../components/Layout/Layout';
import { AuthContextProvider } from '../context/auth-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Layout>
        <Head>
          <title>เพชร BLOG</title>
          <meta name="description" content="เพชร Perosnal Blog - รวบรวมเนื้อหา เทคโนโลยี เกม ภาษาอังกฤษ การออกกำลังกาย และสุขภาพ" />
          <link rel="shortcut icon" href="/images/favicon.ico" />

        </Head>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  )
}

export default MyApp
