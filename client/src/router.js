import { ROUTERS } from "./utils/router/router"
import MasterLayoutMain from "./pages/users/MasterLayoutMain.js"
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/users/HomePage/HomePage.js";
import Register from "./pages/users/Register.js";
import Login from "./pages/users/Login.js";
import MasterLayoutUser from "./pages/users/MasterLayoutUser/MasterLayoutUser.js";
import PersonalInformation from "../src/pages/users/PersonalInformation/PersonalInformation.jsx";
import ChangePassword from "../src/pages/users/ChangePassword/ChangePassword.js";
import BookingHistory from "../src/pages/users/BookingHistory/BookingHistory.js";
import ComplainRepairman from "../src/pages/users/ComplainRepairman/ComplainRepairman.js";
import UpgradeRepairman from "../src/pages/users/UpgradeRepairman/UpgradeRepairman.js";

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
            path: ROUTERS.CUSTOMER.COMPLAIN_REPAIRMAN,
            component: <ComplainRepairman />,
            layout: MasterLayoutUser, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.UPGRADE_REPAIRMAN,
            component: <UpgradeRepairman />,
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


