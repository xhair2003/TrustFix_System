import "../../style/style.scss"
import Header from "../../component/users/customer/Header";
import Footer from "../../component/users/customer/Footer";
import { memo } from "react";

const MasterLayout = ({ children, ...props }) => {
    return (
        <div className="container" {...props}>
            <Header />
            {children}
            <Footer />
        </div>
    );
}

export default memo(MasterLayout);