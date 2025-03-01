import "../../style/style.scss"
import Header from "../../components/users/customer/Header";
import Footer from "../../components/users/customer/Footer";
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