import { ROUTERS } from "./utils/router/router"
import MasterLayoutMain from "./pages/users/MasterLayoutMain.js"
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/users/HomePage/HomePage.js";
import Register from "./pages/users/Register.js";
import Login from "./pages/users/Login.js";
import MasterLayoutUser from "./pages/users/MasterLayoutUser/MasterLayoutUser.js";
import PersonalInformation from "../src/pages/users/PersonalInformation/PersonalInformation.js";
import ChangePassword from "../src/pages/users/ChangePassword/ChangePassword.js";
// import BookingHistory from "../src/pages/users/BookingHistory/BookingHistory.js";
import UpgradeRepairman from "../src/pages/users/UpgradeRepairman/UpgradeRepairman.js";
import Wallet from "./pages/users/Payment/Wallet/Wallet.js";
import DepositHistory from "./pages/users/Payment/DepositHistory/DepositHistory.js";
import HistoryPayment from "./pages/users/Payment/HistoryPayment/HistoryPayment.js";
import ServicePrice from "./pages/users/Payment/ServicePrice/ServicePrice.js";
import Deposit from "./pages/users/Payment/Deposit/Deposit.js";
import Complain from "./pages/users/Complain/Complain.js";
import MakePayment from "./pages/users/Payment/MakePayment/MakePayment.js";
import ViewRepairmentHistories from "./pages/users/customer/ViewRepairmentHistoriesPage/ViewRepairmentHistories.js";
import ForgotPassword from "./pages/users/ForgotPassword.js";
import ResetPasswordForm from "./pages/users/ResetPassword.js";
import ManageUserAccount from "./pages/admin/UserManagement/ManageUserAccount.jsx";
import MasterLayoutAdmin from "./pages/admin/MasterLayoutAdmin/MasterLayoutAdmin.jsx";
import ManageCategories from "./pages/admin/ManageCategories/ManageCategories.jsx";
import ManageComplaints from "./pages/admin/ManageComplaints/ManageComplaints.jsx";
import ManageUpgradeRepairman from "./pages/admin/ManageUpgradeRequests/ManageUpgradeRepairman.jsx";
import ViewDepositHistory from "./pages/admin/TransactionManagement/DepositHistory/ViewDepositHistory.jsx";
import ViewPaymentHistory from "./pages/admin/TransactionManagement/PaymentHistory/ViewPaymentHistory.jsx";
import ManageServicePrices from "./pages/admin/ManageServicePrices/ManageServicePrices.jsx";

const UserROUTERS = () => {
    const routers = [
        {
            path: ROUTERS.CUSTOMER.HOME,
            component: <HomePage />,
            layout: MasterLayoutMain, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.PROFILE,
            component: <PersonalInformation />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.CHANGE_PASSWORD,
            component: <ChangePassword />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.VIEW_REPAIR_BOOKING_HISTORY,
            component: <ViewRepairmentHistories />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.COMPLAIN,
            component: <Complain />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.UPGRADE_REPAIRMAN,
            component: <UpgradeRepairman />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.WALLET,
            component: <Wallet />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.DEPOSIT,
            component: <Deposit />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.DEPOSIT_HISTORY,
            component: <DepositHistory />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.HISTORY_PAYMENT,
            component: <HistoryPayment />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.COMPLAIN,
            component: <Complain />,
            layout: MasterLayoutUser, // Routes using MasterLayoutdsf
        },
        {
            path: ROUTERS.REPAIRMAN.SERVICE_PRICE,
            component: <ServicePrice />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.ADMIN.MANAGE_USER_ACCOUNT,
            component: <ManageUserAccount />,
            layout: MasterLayoutAdmin,
        },
        {
            path: ROUTERS.ADMIN.DASHBOARD,
            // component: <Dashboard />,
            layout: MasterLayoutAdmin, 
        },
        {
            path: ROUTERS.ADMIN.VIEW_REPAIR_BOOKING,
            // component: <ViewRepairBooking />,
            layout: MasterLayoutAdmin, 
        },
        {
            path: ROUTERS.ADMIN.MANAGE_UPGRADE_REPAIRMAN,
            component: <ManageUpgradeRepairman />,
            layout: MasterLayoutAdmin, 
        },
        {
            path: ROUTERS.ADMIN.ADMIN_VIEW_DEPOSIT_HISTORY,
            component: <ViewDepositHistory/>,
            layout: MasterLayoutAdmin, 
        },
        {
            path: ROUTERS.ADMIN.ADMIN_VIEW_HISTORY_PAYMENT,
            component: <ViewPaymentHistory/>,
            layout: MasterLayoutAdmin, 
        },
        {
            path: ROUTERS.ADMIN.MANAGE_COMPLAINTS,
            component: <ManageComplaints />,
            layout: MasterLayoutAdmin, 
        },
        {
            path: ROUTERS.ADMIN.MANAGE_SERVICE,
            component: <ManageServicePrices/>,
            layout: MasterLayoutAdmin, 
        },
        {
            path: ROUTERS.ADMIN.MANAGE_CATEGORIES,
            component: <ManageCategories/>,
            layout: MasterLayoutAdmin, 
        },

        


    ];

    const authRoutes = [
        {
            path: ROUTERS.CUSTOMER.LOGIN,
            component: <Login />,
            layout: null, // No layout for auth routes
        },
        {
            path: ROUTERS.CUSTOMER.REGISTER,
            component: <Register />,
            layout: null, // No layout for auth routes
        },
        {
            path: ROUTERS.CUSTOMER.FORGOT_PASSWORD,
            component: <ForgotPassword/>,
            layout: null, // No layout for auth routes
        },
        {
            path: ROUTERS.CUSTOMER.RESET_PASSWORD,
            component: <ResetPasswordForm/>,
            layout: null, // No layout for auth routes
        },
        
        
        // Add more auth routes here....
    ];

    return (
        <Routes>
            {/* General Routes (with MasterLayout) */}
            {routers.map((item, index) => (
                <Route
                    key={index}
                    path={item.path}
                    element={<item.layout>{item.component}</item.layout>}
                />
            ))}

            {/* Authentication Routes (without MasterLayout) */}
            {authRoutes.map((item, index) => (
                <Route
                    key={index}
                    path={item.path}
                    element={item.component} // No layout for auth routes
                />
            ))}
        </Routes>
    );
};


export default UserROUTERS;

