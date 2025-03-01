import { ROUTERS } from "./utils/router/router"
import MasterLayout from "./pages/users/MasterLayout.js"
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/users/HomePage.js";
import Register from "./pages/users/Register.js";
import Login from "./pages/users/Login.js";
import EditProfilePage from "./pages/users/EditProfilePage";

const UserROUTERS = () => {
    const routers = [
        {
            path: ROUTERS.CUSTOMER.HOME,
            component: <HomePage />,
            layout: MasterLayout, // Routes using MasterLayout
        },
        {
            path: ROUTERS.CUSTOMER.PROFILE,
            component: <EditProfilePage />,
            layout: MasterLayout, // Routes using MasterLayout
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


