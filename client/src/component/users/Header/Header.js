import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/Images/logo.png";
import { FaBell, FaUser, FaLock, FaHistory, FaExclamationCircle, FaSignOutAlt, FaStar, FaWallet } from 'react-icons/fa';
import userImage from '../../../assets/Images/user.jpg';
import './Header.css';

const Header = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const navigate = useNavigate();

    const { isLogin, setIsLogin } = useState(true);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleButtonClick = (index, path) => {
        setActiveIndex(index);
        navigate(path);
    };

    const menuItems = [
        { name: 'Giới Thiệu', path: '/menu1' },
        { name: 'Danh Mục', path: '/menu2' },
        { name: 'Hệ Thống', path: '/menu3' },
        { name: 'Liên Hệ', path: '/menu4' }
    ];

    return (
        <div className="header-container">
            <div className='center-header'>
                <div className='header-logo'>
                    <img src={logo} alt="Logo" className="logo-size" onClick={() => navigate('/')} />
                </div>
                <nav className="header-nav">
                    {menuItems.map((menu, index) => (
                        <button
                            key={index}
                            className={`nav-item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => handleButtonClick(index, menu.path)}
                        >
                            {menu.name}
                        </button>
                    ))}
                </nav>
                {!isLogin ? (
                    <div className="header-buttons">
                        <FaBell className="icon" />
                        <div className="divider"></div>
                        <img
                            src={userImage}
                            alt="User"
                            className="user-icon"
                            onClick={toggleDropdown}
                        />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <img src={userImage} alt="User" className="dropdown-user-icon" />
                                    <div>
                                        <strong>Hoành đẹp trai</strong>
                                        <p className="email-text">nvh01022003@gmail.com</p>
                                    </div>
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/profile")}>
                                    <FaUser className="dropdown-icon" /> Thông tin cá nhân
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/change-password")}>
                                    <FaLock className="dropdown-icon" /> Đổi mật khẩu
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/view-repair-booking-history")}>
                                    <FaHistory className="dropdown-icon" /> Lịch sử đặt dịch vụ
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/complain-repair-man")}>
                                    <FaExclamationCircle className="dropdown-icon" /> Khiếu nại
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/wallet")}>
                                    <FaWallet className="dropdown-icon" /> Ví tiền
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/upgrade-repair-man")}>
                                    <FaStar className="dropdown-icon" /> Nâng cấp lên thợ
                                </div>
                                <div className="dropdown-item" onClick={() => setIsLogin(false)}>
                                    <FaSignOutAlt className="dropdown-icon" /> Đăng xuất
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="header-buttons">
                        <button className="custom-button" onClick={() => navigate('/login')}>Đăng nhập</button>
                        <button className="custom-button" onClick={() => navigate('/register')}>Đăng ký</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
