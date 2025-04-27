import React, { useState, useEffect, useRef } from 'react';
import { FaComments } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getChatHistory, sendMessage, resetErrorMessage } from '../../../store/actions/messageActions';
import Swal from 'sweetalert2';
import socket from '../../../socket';
import './Chat.css';

const Chat = ({ role }) => {
    const dispatch = useDispatch();
    const { messages, loading: loadingMessage, error: errorMessage } = useSelector((state) => state.message);
    const user_id = localStorage.getItem('user_id'); // ID của khách hàng

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [chatList, setChatList] = useState([]); // Danh sách các cuộc trò chuyện
    const [hasNewMessages, setHasNewMessages] = useState({}); // Theo dõi tin nhắn mới

    // Sử dụng useRef để ngăn gọi API liên tục
    const isFetchingRef = useRef(false);

    // Lấy tất cả tin nhắn và xây dựng chatList
    useEffect(() => {
        if (isFetchingRef.current) return; // Ngăn gọi lại nếu đang fetch

        isFetchingRef.current = true;
        dispatch(getChatHistory()) // Gọi getChatHistory không truyền opponent
            .finally(() => {
                isFetchingRef.current = false;
            });

        // Xây dựng chatList từ messages
        const buildChatList = () => {
            if (!Array.isArray(messages)) {
                console.warn('Messages is not an array:', messages);
                setChatList([]);
                return;
            }

            const conversations = messages.reduce((acc, msg) => {
                // Kiểm tra dữ liệu hợp lệ
                if (
                    !msg.senderId?._id ||
                    !msg.receiverId?._id ||
                    !msg.message ||
                    !msg.timestamp
                ) {
                    console.warn('Invalid message:', msg);
                    return acc; // Bỏ qua tin nhắn không hợp lệ (VD: receiverId null)
                }

                const otherId = msg.senderId._id === user_id ? msg.receiverId._id : msg.senderId._id;
                const otherName =
                    msg.senderId._id === user_id
                        ? msg.receiverId.firstName && msg.receiverId.lastName
                            ? `${msg.receiverId.firstName} ${msg.receiverId.lastName}`
                            : `Thợ #${msg.receiverId._id.slice(-6)}`
                        : msg.senderId.firstName && msg.senderId.lastName
                            ? `${msg.senderId.firstName} ${msg.senderId.lastName}`
                            : `Thợ #${msg.senderId._id.slice(-6)}`;

                if (!acc[otherId]) {
                    acc[otherId] = {
                        id: otherId,
                        user: { name: otherName, role: 'repairman' },
                        lastMessage: msg.message,
                        timestamp: msg.timestamp,
                    };
                } else {
                    if (new Date(msg.timestamp) > new Date(acc[otherId].timestamp)) {
                        acc[otherId].lastMessage = msg.message;
                        acc[otherId].timestamp = msg.timestamp;
                    }
                }
                return acc;
            }, {});

            setChatList(Object.values(conversations));
        };

        buildChatList();
    }, [messages, user_id]); // Loại dispatch khỏi dependencies

    // Xử lý lỗi tin nhắn
    useEffect(() => {
        if (errorMessage) {
            Swal.fire({
                title: 'Lỗi',
                text: errorMessage,
                icon: 'error',
                timer: 5000,
                showConfirmButton: false,
            });
            dispatch(resetErrorMessage());
        }
    }, [errorMessage, dispatch]);

    // Lắng nghe WebSocket cho tin nhắn mới
    useEffect(() => {
        const handleReceiveMessage = (message) => {
            if (message.senderId !== user_id && message.receiverId === user_id) {
                setHasNewMessages((prev) => ({
                    ...prev,
                    [message.senderId]: true,
                }));
                // Chỉ gọi getChatHistory nếu chat đang mở hoặc liên quan đến selectedChat
                if (!selectedChat || selectedChat.id === message.senderId) {
                    if (!isFetchingRef.current) {
                        isFetchingRef.current = true;
                        dispatch(getChatHistory()).finally(() => {
                            isFetchingRef.current = false;
                        });
                    }
                }
            }
        };

        if (socket.connected) {
            socket.on('receiveMessage', handleReceiveMessage);
        } else {
            console.warn('Socket not connected yet. Waiting...');
            const onConnect = () => {
                socket.on('receiveMessage', handleReceiveMessage);
            };
            socket.on('connect', onConnect);

            return () => {
                socket.off('connect', onConnect);
                socket.off('receiveMessage', handleReceiveMessage);
            };
        }

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [user_id, selectedChat, dispatch]);

    const toggleChatDropdown = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        setHasNewMessages((prev) => ({
            ...prev,
            [chat.id]: false, // Xóa chấm đỏ khi chọn chat
        }));
        if (!isFetchingRef.current) {
            isFetchingRef.current = true;
            dispatch(getChatHistory(chat.id)).finally(() => {
                isFetchingRef.current = false;
            });
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() && selectedChat) {
            dispatch(sendMessage(selectedChat.id, messageInput));
            setMessageInput('');
            // Cập nhật lastMessage và timestamp trong chatList
            setChatList((prevChats) =>
                prevChats.map((chat) =>
                    chat.id === selectedChat.id
                        ? {
                            ...chat,
                            lastMessage: messageInput,
                            timestamp: new Date().toISOString(),
                        }
                        : chat
                )
            );
        } else {
            Swal.fire({
                title: 'Lỗi',
                text: 'Tin nhắn không được để trống hoặc chưa chọn thợ!',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    const formatMessageTime = (timestamp) => {
        const d = new Date(timestamp);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="chat-container">
            <FaComments
                className={`chat-icon ${Object.values(hasNewMessages).some((v) => v) ? 'has-new-message' : ''}`}
                onClick={toggleChatDropdown}
            />
            {isChatOpen && (
                <div className="user-chat-popup">
                    <div className="user-chat-container">
                        <div className="user-chat-list">
                            <h3 className="user-chat-title">Tin nhắn</h3>
                            {chatList.length > 0 ? (
                                chatList.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className={`user-chat-item ${selectedChat?.id === chat.id ? 'user-chat-selected' : ''
                                            } ${hasNewMessages[chat.id] ? 'has-new-message' : ''}`}
                                        onClick={() => handleSelectChat(chat)}
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
                                    {loadingMessage && <p>Đang tải tin nhắn...</p>}
                                    {messages.length === 0 && !loadingMessage && <p>Chưa có tin nhắn.</p>}
                                    {messages
                                        .filter((msg) => msg.senderId?._id === selectedChat.id || msg.receiverId?._id === selectedChat.id)
                                        .map((message) => (
                                            <div
                                                key={message._id}
                                                className={`user-chat-message ${message.senderId?._id === user_id ? 'user-chat-sent' : 'user-chat-received'
                                                    }`}
                                            >
                                                <div className="user-chat-message-content">
                                                    <p>{message.message}</p>
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
        </div>
    );
};

export default Chat;