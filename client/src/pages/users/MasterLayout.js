import "../../style/style.scss"
import Header from "../../component/users/customer/Header";
import Footer from "../../component/users/customer/Footer";
import LoginForm from "../../component/login/LoginForm";
import RepairmentHistoryItem from "../../component/users/customer/ViewRepairmentHistories/RepairmentHistoryItem";
import RepairmentHistoryList from "../../component/users/customer/ViewRepairmentHistories/RepairmentHistoryList";
import ViewRepairmentHistories from "./customer/ViewRepairmentHistoriesPage/ViewRepairmentHistories";
import { memo } from "react";
import Login from "./Login";
import Register from "./Register";

const MasterLayout = ({ children, ...props }) => {
    return (
        <div className="container" {...props}>
           <ViewRepairmentHistories/>
        </div>
    );
}

export default memo(MasterLayout);