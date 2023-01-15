import Footer from './Footer'
import styles from './Layout.module.css'
import MainNav from './MainNav'

const Layout: React.FC = props => {
    return (
        <>
            <MainNav />
            <div className={styles.body}>{props.children}</div>
            <Footer />
        </>
    )
}

export default Layout
