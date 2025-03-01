import "../../style/style.scss"
import Header from "../../component/users/Header/Header";
import Footer from "../../component/users/Footer/Footer";
import { memo } from "react";

const MasterLayoutMain = ({ children, ...props }) => {
    return (
        <div className="container" {...props}>
            <Header />
            {children}
            <Footer />
        </div>
    );
}

export default memo(MasterLayoutMain);