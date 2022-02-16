import MainNav from "./MainNav";
import Footer from "./Footer";

const Layout:React.FC = (props) => {
    return (
        <>
        <MainNav />
        {props.children}
        <Footer />
        </>        
    )
}

export default Layout;