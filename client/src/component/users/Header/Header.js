import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from "../../../assets/Images/logo.png";
import { FaLevelUpAlt, FaUser, FaLock, FaHistory, FaExclamationCircle, FaSignOutAlt, FaWallet, FaTools, FaHome, FaComments } from 'react-icons/fa';
import { viewRequest, getStatusRepairman, toggleStatusRepairman, resetError } from '../../../store/actions/userActions';
import { logout } from '../../../store/actions/authActions';
import './Header.css';
import Loading from '../../../component/Loading/Loading';
import Swal from "sweetalert2";

const Header = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // States from Redux
    const { request, loading, status, errorGetStatus, errorToggleStatus } = useSelector(state => state.user);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    // Mock chat data - in real app, this would come from Redux or API
    const [chats, setChats] = useState([
        {
            id: 1,
            user: { name: "John Doe", role: "customer" },
            messages: [
                { id: 1, sender: "customer", text: "Hello, can you fix my AC?", timestamp: "2025-04-25T10:00:00Z" },
                { id: 2, sender: "repairman", text: "Hi! Yes, I can help. What's the issue?", timestamp: "2025-04-25T10:05:00Z" }
            ],
            lastMessage: "Hi! Yes, I can help. What's the issue?",
            timestamp: "2025-04-25T10:05:00Z"
        },
        {
            id: 2,
            user: { name: "Jane Smith", role: "customer" },
            messages: [
                { id: 1, sender: "customer", text: "Need plumbing service", timestamp: "2025-04-24T15:30:00Z" }
            ],
            lastMessage: "Need plumbing service",
            timestamp: "2025-04-24T15:30:00Z"
        }
    ]);

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated) || localStorage.getItem('isAuthenticated');
    const role = useSelector(state => state.auth.role) || localStorage.getItem('role');

    // Fetch repairman status and requests on component mount
    useEffect(() => {
        if (role === "repairman") {
            dispatch(getStatusRepairman());
        }
    }, [dispatch, role]);

    // Update isActive based on fetched status
    useEffect(() => {
        if (status !== null && status !== undefined) {
            setIsActive(status !== 'Inactive');
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
                dispatch(resetError());
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
                dispatch(resetError());
                setIsActive(!isActive);
            });
        }
    }, [errorToggleStatus, dispatch, status, isActive]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setIsChatOpen(false);
    };

    const toggleNotificationDropdown = () => {
        setIsNotificationOpen(!isNotificationOpen);
        if (!isNotificationOpen && unreadCount > 0) {
            setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
            setUnreadCount(0);
        }
    };

    const toggleChatDropdown = () => {
        setIsChatOpen(!isChatOpen);
        setIsDropdownOpen(false);
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

    const handleSwitchChange = () => {
        const newStatus = !isActive;
        setIsActive(newStatus);
        dispatch(toggleStatusRepairman());
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() && selectedChat) {
            const newMessage = {
                id: selectedChat.messages.length + 1,
                sender: role,
                text: messageInput,
                timestamp: new Date().toISOString()
            };
            setChats(prevChats =>
                prevChats.map(chat =>
                    chat.id === selectedChat.id
                        ? {
                              ...chat,
                              messages: [...chat.messages, newMessage],
                              lastMessage: messageInput,
                              timestamp: newMessage.timestamp
                          }
                        : chat
                )
            );
            setMessageInput('');
        }
    };

    const menuItems = [
        { name: 'Giới Thiệu', path: '/' },
        { name: 'Tìm Thợ', path: '/find-repairman' },
        { name: 'Chat Bot', path: '/chat-bot' },
        { name: 'Diễn Đàn', path: '/forum' },
        { name: 'Hướng Dẫn', path: '/guides' }
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

    const formatMessageTime = (timestamp) => {
        const d = new Date(timestamp);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
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
                        {role === "repairman" && (
                            <div className="switch-wrapper">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={handleSwitchChange}
                                        disabled={loading}
                                    />
                                    <span className="slider"></span>
                                </label>
                                <span className="switch-label">
                                    {isActive ? "Làm" : "Nghỉ"}
                                </span>
                            </div>
                        )}

                        <div className="divider"></div>
                        <FaComments className="chat-icon" onClick={toggleChatDropdown} />
                        <FaUser className="user-icon" onClick={toggleDropdown} />
                        {isChatOpen && (
                            <div className="user-chat-popup">
                                <div className="user-chat-container">
                                    <div className="user-chat-list">
                                        <h3 className="user-chat-title">Tin nhắn</h3>
                                        {chats.length > 0 ? (
                                            chats.map(chat => (
                                                <div
                                                    key={chat.id}
                                                    className={`user-chat-item ${selectedChat?.id === chat.id ? 'user-chat-selected' : ''}`}
                                                    onClick={() => setSelectedChat(chat)}
                                                >
                                                    <div className="user-chat-info">
                                                        <span className="user-chat-name">{chat.user.name}</span>
                                                        <span className="user-chat-preview">{chat.lastMessage}</span>
                                                    </div>
                                                    <span className="user-chat-time">{formatMessageTime(chat.timestamp)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="user-chat-empty">Chưa có tin nhắn</p>
                                        )}
                                    </div>
                                    {selectedChat && (
                                        <div className="user-chat-messages">
                                            <div className="user-chat-header">
                                                <h3>{selectedChat.user.name}</h3>
                                            </div>
                                            <div className="user-chat-message-area">
                                                {selectedChat.messages.map(message => (
                                                    <div
                                                        key={message.id}
                                                        className={`user-chat-message ${
                                                            message.sender === role ? 'user-chat-sent' : 'user-chat-received'
                                                        }`}
                                                    >
                                                        <div className="user-chat-message-content">
                                                            <p>{message.text}</p>
                                                            <span className="user-chat-message-time">
                                                                {formatMessageTime(message.timestamp)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <form className="user-chat-input-area" onSubmit={handleSendMessage}>
                                                <input
                                                    type="text"
                                                    value={messageInput}
                                                    onChange={(e) => setMessageInput(e.target.value)}
                                                    placeholder="Nhập tin nhắn..."
                                                    className="user-chat-input"
                                                />
                                                <button type="submit" className="user-chat-send-btn">
                                                    Gửi
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                {role === "repairman" && (
                                    <>
                                        <div className="dropdown-item" onClick={() => navigate("/repairman/view-requests")}>
                                            <FaTools className="dropdown-icon" /> Đơn hàng sửa chữa
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate("/repairman/dashboard")}>
                                            <FaHome className="dropdown-icon" /> Tổng quan
                                        </div>
                                    </>
                                )}
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
                                {role === "customer" && (
                                    <div className="dropdown-item" onClick={() => navigate("/upgrade-repair-man")}>
                                        <FaLevelUpAlt className="dropdown-icon" /> Nâng cấp lên thợ
                                    </div>
                                )}
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