import React, { useState } from 'react';
import './MasterLayoutUser.css';
import userImage from '../../../assets/Images/user.jpg';
import { FaUser, FaLock, FaHistory, FaExclamationCircle, FaStar, FaSignOutAlt, FaArrowLeft, FaWallet } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/Images/logo.png";
import onlyLogo from "../../../assets/Images/onlyLogo.jpg";
import { logout } from '../../../store/actions/auth';
import { useDispatch } from 'react-redux';

const MasterLayoutUser = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item.name);
        navigate(item.path);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className="master-layout">
            <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className='upper-sidebar'>
                    <button className="back-button" onClick={() => navigate("/")}>
                        <FaArrowLeft /> {/* Biểu tượng quay về */}
                    </button>
                    <div className="user-info">
                        <img src={userImage} alt="User" className="user-image" />
                        {!isCollapsed && (
                            <>
                                <h2>Nguyễn Văn Hoành</h2>
                                <p>nvh01022003g@gmail.com</p>
                            </>
                        )}
                    </div>

                    <button className="toggle-button" onClick={toggleSidebar}>
                        {isCollapsed ? '☰' : '✖'}
                    </button>
                </div>

                <div className="menu-items">
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
                    <div className={`menu-item ${selectedItem === 'upgrade-repair-man' ? 'active' : ''}`} onClick={() => handleItemClick({ path: "/upgrade-repair-man", name: 'upgrade-repair-man' })}>
                        {isCollapsed ? <FaStar /> : <> <FaStar /> Nâng cấp lên thợ</>}
                    </div>
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
