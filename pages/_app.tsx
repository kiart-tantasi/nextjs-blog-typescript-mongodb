import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from "next/head";
import Layout from '../components/Layout/Layout';
import { AuthContextProvider } from '../context/auth-context';
import { websiteName } from '../utils/sharedData';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Layout>
        <Head>
          <title>{websiteName} | เพชรดอทบล็อก</title>
          <meta name="description" content="เพชรดอทบล็อก - บทความ เทคโนโลยี สอนเขียนโค้ด สอนสร้างแอปพลิเคชั่นและเว็บไซต์ รวมถึงบทความเกม บทความออกกำลังกาย บทความสุขภาพ และ แบ่งปันเรื่องราวในชีวิต" />
          <link rel="shortcut icon" type="image/png" href="/images/image.png" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  )
}

export default MyApp
