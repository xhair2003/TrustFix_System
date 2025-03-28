import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from "../../../assets/Images/logo.png";
import { FaLevelUpAlt, FaWrench, FaBell, FaUser, FaLock, FaHistory, FaExclamationCircle, FaSignOutAlt, FaWallet } from 'react-icons/fa';
import { viewRequest, getStatusRepairman, toggleStatusRepairman, resetError } from '../../../store/actions/userActions';
import { logout } from '../../../store/actions/authActions';
import './Header.css';
import Loading from '../../../component/Loading/Loading';
import Swal from "sweetalert2";

const Header = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isActive, setIsActive] = useState(false); // Initialize as false until status is fetched
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // States from Redux
    const { request, loading, status, errorGetStatus, errorToggleStatus } = useSelector(state => state.user);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated) || localStorage.getItem('isAuthenticated');
    const role = useSelector(state => state.auth.role) || localStorage.getItem('role');

    // Fetch repairman status and requests on component mount
    useEffect(() => {
        if (role === "repairman") {
            dispatch(getStatusRepairman()); // Fetch initial status
            dispatch(viewRequest()); // Fetch requests
        }
    }, [dispatch, role]);

    // Update isActive based on fetched status
    useEffect(() => {
        if (status !== null && status !== undefined) {
            setIsActive(status === 'Active'); // Compare with 'Active' (case-sensitive)
        }
    }, [status]);

    // Handle new request notifications
    useEffect(() => {
        if (request && !notifications.some(n => n._id === request._id)) {
            setNotifications(prev => [...prev, { ...request, isRead: false }]);
            setUnreadCount(prev => prev + 1);
        }
    }, [request, notifications]);

    // Handle errorGetStatus with Swal
    useEffect(() => {
        if (errorGetStatus) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: errorGetStatus,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetError()); // Reset error state
            });
        }
    }, [errorGetStatus, dispatch]);

    // Handle errorToggleStatus with Swal
    useEffect(() => {
        if (errorToggleStatus) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: errorToggleStatus,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetError()); // Reset error state
                setIsActive(status === 'Active'); // Revert switch state on error
            });
        }
    }, [errorToggleStatus, dispatch, status]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleNotificationDropdown = () => {
        setIsNotificationOpen(!isNotificationOpen);
        if (!isNotificationOpen && unreadCount > 0) {
            setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
            setUnreadCount(0);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleButtonClick = (index, path) => {
        setActiveIndex(index);
        if (index === 1 && (isAuthenticated !== true && isAuthenticated !== 'true')) {
            navigate('/login');
        } else {
            navigate(path);
        }
    };

    // Handle toggle status change
    const handleSwitchChange = () => {
        const newStatus = !isActive;
        setIsActive(newStatus); // Optimistically update UI
        dispatch(toggleStatusRepairman());
    };

    const menuItems = [
        { name: 'Giới Thiệu', path: '/' },
        { name: 'Tìm thợ', path: '/find-repairman' },
        { name: 'Hệ Thống', path: '/menu3' },
        { name: 'Liên Hệ', path: '/menu4' }
    ];

    const shortenAddress = (address) => {
        const parts = address.split(", ");
        return parts.slice(1, 4).join(", ");
    };

    const formatDateTime = (date) => {
        const d = new Date(date);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
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
                        {/* Switch for repairman */}
                        {role === "repairman" && (
                            <div className="switch-wrapper">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={handleSwitchChange}
                                        disabled={loading} // Disable during loading
                                    />
                                    <span className="slider"></span>
                                </label>
                                <span className="switch-label">
                                    {isActive ? "Làm" : "Nghỉ"}
                                </span>
                            </div>
                        )}

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
                                                <p><strong>Có đơn hàng mới:</strong> {notif.description}</p>
                                                <p><strong>Khu vực:</strong> {shortenAddress(notif.address)}</p>
                                                <p><strong>Ngày:</strong> {formatDateTime(notif.createdAt)}</p>
                                                <a
                                                    onClick={() => {
                                                        setIsNotificationOpen(false);
                                                        navigate(`/repairman/detail-request/${notif._id}`, {
                                                            state: { requestData: notif },
                                                        });
                                                    }}
                                                    style={{ cursor: 'pointer' }}
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
                            <div className="dropdown-menu">
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
                                <div className="dropdown-item" onClick={handleLogout}>
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
            {loading && <Loading />}
        </div>
    );
};

export default Header;