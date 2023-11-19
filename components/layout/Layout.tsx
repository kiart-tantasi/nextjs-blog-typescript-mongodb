import Footer from './Footer'
import styles from './Layout.module.css'
import MainNav from './MainNav'
import { Analytics } from '@vercel/analytics/react';

const Layout: React.FC = props => {
    return (
        <>
            <MainNav />
            <div className={styles.body}>{props.children}</div>
            <Footer />
            <Analytics />
        </>
    )
}

export default Layout
