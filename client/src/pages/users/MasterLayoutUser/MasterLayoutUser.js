import React, { useState, useEffect } from 'react';
import './MasterLayoutUser.css';
import { FaLevelUpAlt, FaWrench, FaUser, FaLock, FaHistory, FaExclamationCircle, FaStar, FaSignOutAlt, FaArrowLeft, FaWallet } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/Images/logo.png";
import onlyLogo from "../../../assets/Images/onlyLogo.jpg";
import { logout } from '../../../store/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, resetError } from '../../../store/actions/userActions';
import Loading from '../../../component/Loading/Loading';
import Swal from "sweetalert2";

const MasterLayoutUser = ({ children }) => {
    const role = useSelector(state => state.auth.role) || localStorage.getItem('role');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo, loading, error } = useSelector((state) => state.user); // Lấy thông tin từ Redux

    // Nếu userInfo chưa có, hiển thị thông báo hoặc giá trị mặc định
    useEffect(() => {
        if (!userInfo) {
            dispatch(getUserInfo()); // Gọi action để lấy thông tin người dùng nếu chưa có
        }
    }, [dispatch, userInfo]); // Thêm userInfo vào dependency để re-fetch nếu cần

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: error,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetError());
            });
        }
    }, [error, dispatch]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item.name);
        navigate(item.path);
    };

    const handleLogout = () => {
        dispatch(logout());
        // Sau khi đăng xuất thành công, điều hướng đến trang đăng nhập
        navigate('/login');
    };

    // if (loading) { return <Loading /> }

    // Kiểm tra userInfo trước khi truy cập thuộc tính
    const username = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Người dùng chưa đăng nhập";
    const email = userInfo ? `${userInfo.email}` : "Chưa có email";

    //console.log(userInfo);

    return (
        <div className="master-layout">
            <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className='upper-sidebar'>
                    <button className="back-button" onClick={() => navigate("/")}>
                        <FaArrowLeft /> {/* Biểu tượng quay về */}
                    </button>
                    <div className="user-info">
                        <img
                            src={userInfo?.imgAvt}
                            alt="User"
                            className="user-image"
                        />
                        {!isCollapsed && (
                            <>
                                <h2>{username}</h2>
                                <p>{email}</p>
                            </>
                        )}
                    </div>

                    <button className="toggle-button" onClick={toggleSidebar}>
                        {isCollapsed ? '☰' : '✖'}
                    </button>
                </div>

                <div className="menu-items">
                    {role === 'repairman' &&
                        <div className={`menu-item ${selectedItem === 'repairman/view-requests' ? 'active' : ''}`} onClick={() => handleItemClick({ path: "/repairman/view-requests", name: 'repairman/view-requests' })}>
                            {isCollapsed ? <FaWrench /> : <> <FaWrench /> Đơn hàng sửa chữa</>}
                        </div>
                    }
                    <div className={`menu-item ${selectedItem === 'profile' ? 'active' : ''}`} onClick={() => handleItemClick({ path: "/profile", name: 'profile' })}>
                        {isCollapsed ? <FaUser /> : <> <FaUser /> Thông tin cá nhân</>}
                    </div>
                    <div className={`menu-item ${selectedItem === 'change-password' ? 'active' : ''}`} onClick={() => handleItemClick({ path: "/change-password", name: 'change-password' })}>
                        {isCollapsed ? <FaLock /> : <> <FaLock /> Đổi mật khẩu</>}
                    </div>
                    <div className={`menu-item ${selectedItem === 'view-repair-booking-history' ? 'active' : ''}`} onClick={() => handleItemClick({ path: "/view-repair-booking-history", name: 'view-repair-booking-history' })}>
                        {isCollapsed ? <FaHistory /> : <> <FaHistory /> Lịch sử đặt dịch vụ</>}
                    </div>
                    <div className={`menu-item ${selectedItem === 'complain' ? 'active' : ''}`} onClick={() => handleItemClick({ path: "/complain", name: 'complain' })}>
                        {isCollapsed ? <FaExclamationCircle /> : <> <FaExclamationCircle /> Khiếu nại</>}
                    </div>
                    <div className={`menu-item ${selectedItem === 'wallet' ? 'active' : ''}`} onClick={() => handleItemClick({ path: "/wallet", name: 'wallet' })}>
                        {isCollapsed ? <FaWallet /> : <> <FaWallet /> Ví tiền</>}
                    </div>
                    {role === 'customer' &&
                        <div className={`menu-item ${selectedItem === 'upgrade-repair-man' ? 'active' : ''}`} onClick={() => handleItemClick({ path: "/upgrade-repair-man", name: 'upgrade-repair-man' })}>
                            {isCollapsed ? <FaLevelUpAlt /> : <> <FaLevelUpAlt /> Nâng cấp lên thợ</>}
                        </div>
                    }
                    <div className={`menu-item ${selectedItem === 'logout' ? 'active' : ''}`} onClick={handleLogout}>
                        {isCollapsed ? <FaSignOutAlt /> : <> <FaSignOutAlt /> Đăng xuất</>}
                    </div>
                </div>

                <div>
                    <img
                        src={isCollapsed ? onlyLogo : logo}
                        alt="Logo"
                        className={isCollapsed ? "only-logo" : "lower-sidebar"}
                    />
                </div>

            </div>
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default MasterLayoutUser;
