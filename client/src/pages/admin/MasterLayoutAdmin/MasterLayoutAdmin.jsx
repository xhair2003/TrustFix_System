import React, { useState, useEffect } from 'react';
import './MasterLayoutAdmin.css';
import adminImage from '../../../assets/Images/user.jpg'; // Placeholder for admin image
import { FaBook, FaHome, FaUsers, FaHistory, FaExclamationCircle, FaWallet, FaStar, FaCertificate, FaFileAlt, FaArrowLeft, FaFolder } from 'react-icons/fa'; // Thêm FaFolder
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/Images/logo.png';
import onlyLogo from '../../../assets/Images/onlyLogo.jpg';
import { logout } from '../../../store/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, resetError } from '../../../store/actions/userActions';
import Swal from "sweetalert2";
import Loading from '../../../component/Loading/Loading';

const MasterLayoutAdmin = ({ children }) => {
    const dispatch = useDispatch();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedItem, setSelectedItem] = useState('overview'); // Default to 'overview'
    const navigate = useNavigate();
    const { userInfo, loading, error } = useSelector((state) => state.user); // Lấy thông tin từ Redux

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

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

    const handleItemClick = (item) => {
        setSelectedItem(item.name);
        navigate(item.path);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Kiểm tra userInfo trước khi truy cập thuộc tính
    const username = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Người dùng chưa đăng nhập";
    const email = userInfo ? `${userInfo.email}` : "Chưa có email";

    // if (loading) { return <Loading /> }

    return (
        <div className="master-layout">
            <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className='upper-sidebar'>
                    {!isCollapsed && <h1 className="admin-label">ADMIN</h1>}

                    <div className="user-info">
                        <img src={adminImage} alt="Admin" className="user-image" />
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
                    <div
                        className={`menu-item ${selectedItem === 'overview' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/dashboard', name: 'overview' })}
                    >
                        {isCollapsed ? <FaHome /> : <> <FaHome /> Tổng quan</>}

                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'user-management' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-user-account', name: 'user-management' })}
                    >
                        {isCollapsed ? <FaUsers /> : <> <FaUsers /> Quản lý người dùng</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'manage-categories' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-categories', name: 'manage-categories' })}
                    >
                        {isCollapsed ? <FaFolder /> : <> <FaFolder /> Quản lý chuyên mục</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'manage-subcategories' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-subcategories', name: 'manage-subcategories' })}
                    >
                        {isCollapsed ? <FaFolder /> : <> <FaFolder /> Quản lý danh mục</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'manage-order-history' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/view-repair-booking', name: 'manage-order-history' })}
                    >
                        {isCollapsed ? <FaHistory /> : <> <FaHistory /> Quản lý lịch sử đặt thợ</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'manage-upgrade-requests' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-upgrade-repairman', name: 'manage-upgrade-requests' })}
                    >
                        {isCollapsed ? <FaExclamationCircle /> : <> <FaExclamationCircle /> Quản lý nâng cấp thợ</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'transaction-management' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/view-deposit-history', name: 'transaction-management' })}
                    >
                        {isCollapsed ? <FaWallet /> : <> <FaWallet /> Quản lý giao dịch</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'vip' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-service-prices', name: 'vip' })}
                    >
                        {isCollapsed ? <FaStar /> : <> <FaStar /> Quản lý dịch vụ đề xuất</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'manage-practice-certificates' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-practice-certificates', name: 'manage-practice-certificates' })}
                    >
                        {isCollapsed ? <FaCertificate /> : <> <FaCertificate /> Quản lý chứng chỉ hành nghề</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'report' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-complaints', name: 'report' })}
                    >
                        {isCollapsed ? <FaFileAlt /> : <> <FaFileAlt /> Quản lý khiếu nại</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'manage-new-forum-post' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-new-forum-post', name: 'manage-new-forum-post' })}
                    >
                        {isCollapsed ? <FaFileAlt /> : <> <FaFileAlt /> Bài đăng diễn đàn mới</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'manage-guides' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-guides', name: 'manage-guides' })}
                    >
                        {isCollapsed ? <FaBook /> : <> <FaBook /> Quản lý hướng dẫn</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'logout' ? 'active' : ''}`}
                        onClick={handleLogout}
                    >
                        {isCollapsed ? <FaArrowLeft /> : <> <FaArrowLeft /> Đăng xuất</>}
                    </div>
                </div>

                <div>
                    <img
                        src={isCollapsed ? onlyLogo : logo}
                        alt="Logo"
                        className={isCollapsed ? 'only-logo' : 'lower-sidebar'}
                    />
                </div>
            </div>
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default MasterLayoutAdmin;