import "../../style/style.scss"
import Header from "../../component/users/customer/Header";
import Footer from "../../component/users/customer/Footer";
import LoginForm from "../../component/users/login/LoginForm";
import { memo } from "react";
import Login from "./Login";
import Register from "./Register";

const MasterLayout = ({ children, ...props }) => {
    return (
        <div className="container" {...props}>
            {/* <Header />
            {children}
            <Footer /> */}
            {/* <Login/> */}
            <Register/>
        </div>
    );
}

export default memo(MasterLayout);