import React, { useState } from 'react';
import './MasterLayoutAdmin.css';
import adminImage from '../../../assets/Images/user.jpg'; // Placeholder for admin image
import { FaHome, FaUsers, FaHistory, FaExclamationCircle, FaWallet, FaStar, FaCertificate, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/Images/logo.png';
import onlyLogo from '../../../assets/Images/onlyLogo.jpg';

const MasterLayoutAdmin = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedItem, setSelectedItem] = useState('overview'); // Default to 'overview' to match the image
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item.name);
        navigate(item.path);
    };

    return (
        <div className="master-layout">
            <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className='upper-sidebar'>
                    {/* Add "ADMIN" label */}
                    {!isCollapsed && <h1 className="admin-label">ADMIN</h1>}
                    
                    <div className="user-info">
                        <img src={adminImage} alt="Admin" className="user-image" />
                        {!isCollapsed && (
                            <>
                                <h2>ImDew</h2>
                                <p>dewgotthebag@admin.vn</p>
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
                        {isCollapsed ? <FaHome /> : <> <FaHome /> Overview</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'user-management' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-user-account', name: 'user-management' })}
                    >
                        {isCollapsed ? <FaUsers /> : <> <FaUsers /> User Management</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'manage-order-history' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/view-repair-booking', name: 'manage-order-history' })}
                    >
                        {isCollapsed ? <FaHistory /> : <> <FaHistory /> Manage Order History</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'manage-upgrade-requests' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-upgrade-repairman', name: 'manage-upgrade-requests' })}
                    >
                        {isCollapsed ? <FaExclamationCircle /> : <> <FaExclamationCircle /> Manage Upgrade Requests</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'transaction-management' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/view-deposit-history', name: 'transaction-management' })}
                    >
                        {isCollapsed ? <FaWallet /> : <> <FaWallet /> Transaction Management</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'vip' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-service-prices', name: 'vip' })}
                    >
                        {isCollapsed ? <FaStar /> : <> <FaStar /> VIP</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'manage-practice-certificate' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-practice-certificate', name: 'manage-practice-certificate' })}
                    >
                        {isCollapsed ? <FaCertificate /> : <> <FaCertificate /> Manage Practice Certificate</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'report' ? 'active' : ''}`}
                        onClick={() => handleItemClick({ path: '/admin/manage-complaints', name: 'report' })}
                    >
                        {isCollapsed ? <FaFileAlt /> : <> <FaFileAlt /> Report</>}
                    </div>
                    <div
                        className={`menu-item ${selectedItem === 'logout' ? 'active' : ''}`}
                        onClick={() => { /* Handle logout */ }}
                    >
                        {isCollapsed ? <FaArrowLeft /> : <> <FaArrowLeft /> Logout</>}
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