import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from "../../../assets/Images/logo.png";
import { FaLevelUpAlt, FaWrench, FaBell, FaUser, FaLock, FaHistory, FaExclamationCircle, FaSignOutAlt, FaWallet } from 'react-icons/fa';
import { viewRequest } from '../../../store/actions/userActions'; // Action lấy danh sách đơn
import { logout } from '../../../store/actions/authActions';
import './Header.css';

const Header = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //const { user } = useSelector(state => state.auth);
    const { request } = useSelector(state => state.user); // Lấy request từ Redux
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated) || localStorage.getItem('isAuthenticated');
    const role = useSelector(state => state.auth.role) || localStorage.getItem('role');

    // Polling để kiểm tra đơn mới
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         dispatch(viewRequest());
    //     }, 5000); // Kiểm tra mỗi 5 giây
    //     return () => clearInterval(interval);
    // }, [dispatch]);

    // Cập nhật danh sách thông báo khi có đơn mới
    useEffect(() => {
        if (request && !notifications.some(n => n._id === request._id)) {
            setNotifications(prev => [...prev, { ...request, isRead: false }]);
            setUnreadCount(prev => prev + 1);
        }
    }, [request, notifications]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleNotificationDropdown = () => {
        setIsNotificationOpen(!isNotificationOpen);
        if (!isNotificationOpen && unreadCount > 0) {
            // Đánh dấu tất cả là đã đọc khi mở dropdown
            setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
            setUnreadCount(0);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        // Sau khi đăng xuất thành công, điều hướng đến trang đăng nhập
        navigate('/login');
    };

    const handleButtonClick = (index, path) => {
        setActiveIndex(index);
        // Kiểm tra nếu click vào "Tìm thợ" (index === 1) và chưa đăng nhập
        if (index === 1 && (isAuthenticated !== true && isAuthenticated !== 'true')) {
            navigate('/login');
        } else {
            navigate(path);
        }
    };

    const menuItems = [
        { name: 'Giới Thiệu', path: '/' },
        { name: 'Tìm thợ', path: '/find-repairman' },
        { name: 'Hệ Thống', path: '/menu3' },
        { name: 'Liên Hệ', path: '/menu4' }
    ];

    const shortenAddress = (address) => {
        const parts = address.split(", ");
        return parts.slice(1, 4).join(", "); // Lấy phường, quận, thành phố
    };

    // Hàm định dạng ngày và giờ theo kiểu hh:mm dd/mm/yyyy
    const formatDateTime = (date) => {
        const d = new Date(date);
        const hours = d.getHours().toString().padStart(2, '0'); // Lấy giờ
        const minutes = d.getMinutes().toString().padStart(2, '0'); // Lấy phút
        const day = d.getDate().toString().padStart(2, '0'); // Lấy ngày
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng
        const year = d.getFullYear(); // Lấy năm

        return `${hours}:${minutes} ${day}/${month}/${year}`; // Trả về định dạng hh:mm dd/mm/yyyy
    };

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

                {isAuthenticated === true || isAuthenticated === 'true' ? (
                    <div className="header-buttons">
                        <div className="notification-wrapper">
                            <FaBell className="icon" onClick={toggleNotificationDropdown} />
                            {unreadCount > 0 && (
                                <span className="notification-badge">{unreadCount}</span>
                            )}
                            {isNotificationOpen && (
                                <div className="notification-dropdown">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div key={notif._id} className="notification-item">
                                                <p>Có đơn hàng mới: {notif.description}</p>
                                                <p>Khu vực: {shortenAddress(notif.address)}</p>
                                                <p>Ngày: {formatDateTime(notif.createdAt)}</p>
                                                <a
                                                    onClick={() => {
                                                        setIsNotificationOpen(false);
                                                        navigate(`/repairman/detail-request/${notif._id}`, {
                                                            state: { requestData: notif },
                                                        });
                                                    }}
                                                >
                                                    Xem chi tiết ngay!
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Không có thông báo mới.</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="divider"></div>
                        <FaUser className="user-icon" onClick={toggleDropdown} />
                        {isDropdownOpen && (
                            < div className="dropdown-menu">
                                {role === "repairman" &&
                                    <div className="dropdown-item" onClick={() => navigate("/repairman/view-requests")}>
                                        <FaWrench className="dropdown-icon" /> Đơn hàng sửa chữa
                                    </div>
                                }
                                <div className="dropdown-item" onClick={() => navigate("/profile")}>
                                    <FaUser className="dropdown-icon" /> Thông tin cá nhân
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/change-password")}>
                                    <FaLock className="dropdown-icon" /> Đổi mật khẩu
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/view-repair-booking-history")}>
                                    <FaHistory className="dropdown-icon" /> Lịch sử đặt dịch vụ
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/complain")}>
                                    <FaExclamationCircle className="dropdown-icon" /> Khiếu nại
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/wallet")}>
                                    <FaWallet className="dropdown-icon" /> Ví tiền
                                </div>
                                {role === "customer" &&
                                    <div className="dropdown-item" onClick={() => navigate("/upgrade-repair-man")}>
                                        <FaLevelUpAlt className="dropdown-icon" /> Nâng cấp lên thợ
                                    </div>
                                }
                                <div className="dropdown-item" onClick={handleLogout} >
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
        </div >
    );
};

export default Header;