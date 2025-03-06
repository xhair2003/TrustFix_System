import { ROUTERS } from "./utils/router/router"
import MasterLayoutMain from "./pages/users/MasterLayoutMain.js"
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/users/HomePage/HomePage.js";
import Register from "./pages/users/Register.js";
import Login from "./pages/users/Login.js";
import MasterLayoutUser from "./pages/users/MasterLayoutUser/MasterLayoutUser.js";
import PersonalInformation from "../src/pages/users/PersonalInformation/PersonalInformation.js";
import ChangePassword from "../src/pages/users/ChangePassword/ChangePassword.js";
import BookingHistory from "../src/pages/users/BookingHistory/BookingHistory.js";
import UpgradeRepairman from "../src/pages/users/UpgradeRepairman/UpgradeRepairman.js";
import Wallet from "./pages/users/Payment/Wallet/Wallet.js";
import DepositHistory from "./pages/users/Payment/DepositHistory/DepositHistory.js";
import HistoryPayment from "./pages/users/Payment/HistoryPayment/HistoryPayment.js";
import ServicePrice from "./pages/users/Payment/ServicePrice/ServicePrice.js";
import Deposit from "./pages/users/Payment/Deposit/Deposit.js";
import Complain from "./pages/users/Complain/Complain.js";
import MakePayment from "./pages/users/Payment/MakePayment/MakePayment.js";

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
            component: <BookingHistory />,
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
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.REPAIRMAN.SERVICE_PRICE,
            component: <ServicePrice />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },

        // Add more routes here...
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
            path: ROUTERS.CUSTOMER.MAKE_PAYMENT,
            component: <MakePayment />,
            layout: null, // Routes using MasterLayout
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

