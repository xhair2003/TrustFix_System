// import React, { useState, useEffect, useRef } from 'react';
// import { FaComments } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { getChatHistory, sendMessage, resetErrorMessage } from '../../../store/actions/messageActions';
// import Swal from 'sweetalert2';
// import socket from '../../../socket';
// import './Chat.css';

// const Chat = () => {
//     const dispatch = useDispatch();
//     const { messages, loading: loadingMessage, error: errorMessage } = useSelector((state) => state.message);
//     const user_id = localStorage.getItem('user_id');
//     const request_id = localStorage.getItem('requestId');
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [selectedChat, setSelectedChat] = useState(null);
//     const [messageInput, setMessageInput] = useState('');
//     const [chatList, setChatList] = useState([]);
//     const [hasNewMessages, setHasNewMessages] = useState({});
//     const [hasNewMessageForIcon, setHasNewMessageForIcon] = useState(false);
//     const isFetchingRef = useRef(false);

//     // Log trạng thái hasNewMessageForIcon trong render
//     //console.log('Render - hasNewMessageForIcon:', hasNewMessageForIcon);
//     console.log('Chatlist:', chatList);

//     // Lấy tin nhắn và xây dựng chatList
//     useEffect(() => {
//         if (!request_id) {
//             console.warn('No request_id found in localStorage');
//             return;
//         }

//         if (isFetchingRef.current) return;

//         isFetchingRef.current = true;
//         //console.log('Fetching chat history for request_id:', request_id);
//         dispatch(getChatHistory(null, request_id))
//             .finally(() => {
//                 isFetchingRef.current = false;
//             });

//         // Xây dựng chatList từ messages
//         const buildChatList = () => {
//             //console.log('Messages received:', messages);
//             if (!Array.isArray(messages)) {
//                 console.warn('Messages is not an array:', messages);
//                 setChatList([]);
//                 return;
//             }

//             const conversations = messages.reduce((acc, msg) => {
//                 const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
//                 const receiverId = typeof msg.receiverId === 'object' ? msg.receiverId?._id : msg.receiverId;

//                 if (!senderId || !receiverId || !msg.message || !msg.timestamp) {
//                     console.warn('Invalid message:', msg);
//                     return acc;
//                 }

//                 const otherId = senderId === user_id ? receiverId : senderId;
//                 const otherName = senderId === user_id
//                     ? (msg.receiverId?.firstName && msg.receiverId?.lastName
//                         ? `${msg.receiverId.firstName} ${msg.receiverId.lastName}`
//                         : `Thợ #${receiverId.slice(-6)}`)
//                     : (msg.senderId?.firstName && msg.senderId?.lastName
//                         ? `${msg.senderId.firstName} ${msg.senderId.lastName}`
//                         : `Thợ #${senderId.slice(-6)}`);

//                 if (!acc[otherId]) {
//                     acc[otherId] = {
//                         id: otherId,
//                         user: { name: otherName, role: 'repairman' },
//                         lastMessage: msg.message,
//                         timestamp: msg.timestamp,
//                     };
//                 } else if (new Date(msg.timestamp) > new Date(acc[otherId].timestamp)) {
//                     acc[otherId].lastMessage = msg.message;
//                     acc[otherId].timestamp = msg.timestamp;
//                 }
//                 return acc;
//             }, {});

//             const newChatList = Object.values(conversations);
//             //console.log('ChatList built:', newChatList);
//             setChatList(newChatList);

//             // Tự động chọn chat đầu tiên nếu chưa có selectedChat
//             if (newChatList.length > 0 && !selectedChat) {
//                 setSelectedChat(newChatList[0]);
//             }
//         };

//         buildChatList();
//     }, [messages, user_id, request_id, selectedChat]);

//     // Xử lý lỗi tin nhắn
//     useEffect(() => {
//         if (errorMessage) {
//             Swal.fire({
//                 title: 'Lỗi',
//                 text: errorMessage,
//                 icon: 'error',
//                 timer: 5000,
//                 showConfirmButton: false,
//             });
//             dispatch(resetErrorMessage());
//         }
//     }, [errorMessage, dispatch]);

//     // Lắng nghe WebSocket cho tin nhắn mới
//     useEffect(() => {
//         const handleReceiveMessage = (message) => {
//             //console.log('Received message:', message);
//             const senderId = typeof message.senderId === 'object' ? message.senderId?._id : message.senderId;
//             const receiverId = typeof message.receiverId === 'object' ? message.receiverId?._id : message.receiverId;

//             if (senderId !== user_id && receiverId === user_id) {
//                 setHasNewMessages((prev) => ({
//                     ...prev,
//                     [senderId]: true,
//                 }));
//                 //console.log('Setting hasNewMessageForIcon to true');
//                 setHasNewMessageForIcon(true);
//                 // Tự động chọn chat của senderId nếu chưa có selectedChat
//                 if (!selectedChat) {
//                     setSelectedChat({
//                         id: senderId,
//                         user: { name: `Thợ #${senderId.slice(-6)}`, role: 'repairman' },
//                         lastMessage: message.message,
//                         timestamp: message.timestamp,
//                     });
//                 }
//                 // Luôn gọi getChatHistory để cập nhật messages
//                 if (!isFetchingRef.current) {
//                     isFetchingRef.current = true;
//                     //console.log('Fetching chat history due to new message');
//                     dispatch(getChatHistory(null, request_id)).finally(() => {
//                         isFetchingRef.current = false;
//                     });
//                 }
//             } else {
//                 console.warn('Message not processed:', { senderId, receiverId, user_id });
//             }
//         };

//         socket.on('receiveMessage', handleReceiveMessage);

//         return () => {
//             socket.off('receiveMessage', handleReceiveMessage);
//         };
//     }, [user_id, dispatch, request_id, selectedChat]);

//     const toggleChatDropdown = () => {
//         setIsChatOpen(!isChatOpen);
//         // Chỉ reset hasNewMessageForIcon nếu đang mở chat và có tin nhắn chưa xem
//         if (!isChatOpen && Object.values(hasNewMessages).some((hasNew) => hasNew)) {
//             setHasNewMessageForIcon(false);
//         }
//         if (!isChatOpen && !isFetchingRef.current) {
//             isFetchingRef.current = true;
//             // console.log('Fetching chat history on open');
//             dispatch(getChatHistory(null, request_id)).finally(() => {
//                 isFetchingRef.current = false;
//             });
//         }
//     };

//     const handleSelectChat = (chat) => {
//         setSelectedChat(chat);
//         setHasNewMessages((prev) => ({
//             ...prev,
//             [chat.id]: false,
//         }));
//         // Reset hasNewMessageForIcon nếu không còn tin nhắn mới
//         const hasRemainingNewMessages = Object.values({
//             ...hasNewMessages,
//             [chat.id]: false,
//         }).some((hasNew) => hasNew);
//         if (!hasRemainingNewMessages) {
//             //console.log('Resetting hasNewMessageForIcon: no remaining new messages');
//             setHasNewMessageForIcon(false);
//         }
//         if (!isFetchingRef.current) {
//             isFetchingRef.current = true;
//             //console.log('Fetching chat history on chat select');
//             dispatch(getChatHistory(null, request_id)).finally(() => {
//                 isFetchingRef.current = false;
//             });
//         }
//     };

//     const handleSendMessage = (e) => {
//         e.preventDefault();
//         if (messageInput.trim() && selectedChat) {
//             dispatch(sendMessage(selectedChat.id, messageInput, user_id, request_id));
//             setMessageInput('');
//             setChatList((prevChats) =>
//                 prevChats.map((chat) =>
//                     chat.id === selectedChat.id
//                         ? {
//                             ...chat,
//                             lastMessage: messageInput,
//                             timestamp: new Date().toISOString(),
//                         }
//                         : chat
//                 )
//             );
//         } else {
//             Swal.fire({
//                 title: 'Lỗi',
//                 text: 'Tin nhắn không được để trống hoặc chưa chọn thợ!',
//                 icon: 'error',
//                 timer: 3000,
//                 showConfirmButton: false,
//             });
//         }
//     };

//     const formatMessageTime = (timestamp) => {
//         const d = new Date(timestamp);
//         const hours = d.getHours().toString().padStart(2, '0');
//         const minutes = d.getMinutes().toString().padStart(2, '0');
//         return `${hours}:${minutes}`;
//     };

//     return (
//         <div className="chat-container">
//             <div className="chat-icon-wrapper">
//                 <FaComments
//                     className="chat-icon"
//                     onClick={toggleChatDropdown}
//                 />
//                 {hasNewMessageForIcon && (
//                     <span className="chat-notification-dot"></span>
//                 )}
//             </div>
//             {isChatOpen && (
//                 <div className="user-chat-popup">
//                     <div className="user-chat-container">
//                         <div className="user-chat-list">
//                             <h3 className="user-chat-title">Tin nhắn</h3>
//                             {chatList.length > 0 ? (
//                                 chatList.map((chat) => (
//                                     <div
//                                         key={chat.id}
//                                         className={`user-chat-item ${selectedChat?.id === chat.id ? 'user-chat-selected' : ''
//                                             } ${hasNewMessages[chat.id] ? 'has-new-message' : ''}`}
//                                         onClick={() => handleSelectChat(chat)}
//                                     >
//                                         <div className="user-chat-info">
//                                             <span className="user-chat-name">{chat.user.name}</span>
//                                             <span className="user-chat-preview">{chat.lastMessage}</span>
//                                         </div>
//                                         <span className="user-chat-time">{formatMessageTime(chat.timestamp)}</span>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="user-chat-empty">Chưa có tin nhắn</p>
//                             )}
//                         </div>
//                         {selectedChat && (
//                             <div className="user-chat-messages">
//                                 <div className="user-chat-header">
//                                     <h3>{selectedChat.user.name}</h3>
//                                 </div>
//                                 <div className="user-chat-message-area">
//                                     {loadingMessage && <p>Đang tải tin nhắn...</p>}
//                                     {messages.length === 0 && !loadingMessage && <p>Chưa có tin nhắn.</p>}
//                                     {messages
//                                         .filter((msg) => {
//                                             const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
//                                             const receiverId = typeof msg.receiverId === 'object' ? msg.receiverId?._id : msg.receiverId;
//                                             return senderId === selectedChat.id || receiverId === selectedChat.id;
//                                         })
//                                         .map((message) => (
//                                             <div
//                                                 key={message._id}
//                                                 className={`user-chat-message ${message.senderId?._id === user_id || message.senderId === user_id ? 'user-chat-sent' : 'user-chat-received'}`}
//                                             >
//                                                 <div className="user-chat-message-content">
//                                                     <p>{message.message}</p>
//                                                     <span className="user-chat-message-time">
//                                                         {formatMessageTime(message.timestamp)}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                 </div>
//                                 <form className="user-chat-input-area" onSubmit={handleSendMessage}>
//                                     <input
//                                         type="text"
//                                         value={messageInput}
//                                         onChange={(e) => setMessageInput(e.target.value)}
//                                         placeholder="Nhập tin nhắn..."
//                                         className="user-chat-input"
//                                     />
//                                     <button type="submit" className="user-chat-send-btn">
//                                         Gửi
//                                     </button>
//                                 </form>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Chat;


import React, { useState, useEffect, useRef } from 'react';
import { FaComments } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getChatHistory, sendMessage, resetErrorMessage } from '../../../store/actions/messageActions';
import Swal from 'sweetalert2';
import socket from '../../../socket';
import './Chat.css';

const Chat = () => {
    const dispatch = useDispatch();
    const { messages, loading: loadingMessage, error: errorMessage } = useSelector((state) => state.message);
    const user_id = localStorage.getItem('user_id');
    const request_id = localStorage.getItem('requestId');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [chatList, setChatList] = useState([]);
    const [hasNewMessages, setHasNewMessages] = useState({});
    const [hasNewMessageForIcon, setHasNewMessageForIcon] = useState(false);
    const isFetchingRef = useRef(false);

    console.log('Chatlist:', chatList);

    // Hàm xây dựng chatList từ messages
    const buildChatList = (messages) => {
        if (!Array.isArray(messages)) {
            console.warn('Messages is not an array:', messages);
            setChatList([]);
            return;
        }

        const conversations = messages.reduce((acc, msg) => {
            const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
            const receiverId = typeof msg.receiverId === 'object' ? msg.receiverId?._id : msg.receiverId;

            if (!senderId || !receiverId || !msg.message || !msg.timestamp) {
                console.warn('Invalid message:', msg);
                return acc;
            }

            const otherId = senderId === user_id ? receiverId : senderId;
            const otherName = senderId === user_id
                ? (msg.receiverId?.firstName && msg.receiverId?.lastName
                    ? `${msg.receiverId.firstName} ${msg.receiverId.lastName}`
                    : `Thợ #${receiverId.slice(-6)}`)
                : (msg.senderId?.firstName && msg.senderId?.lastName
                    ? `${msg.senderId.firstName} ${msg.senderId.lastName}`
                    : `Thợ #${senderId.slice(-6)}`);

            if (!acc[otherId]) {
                acc[otherId] = {
                    id: otherId,
                    user: { name: otherName, role: 'repairman' },
                    lastMessage: msg.message,
                    timestamp: msg.timestamp,
                };
            } else if (new Date(msg.timestamp) > new Date(acc[otherId].timestamp)) {
                acc[otherId].lastMessage = msg.message;
                acc[otherId].timestamp = msg.timestamp;
            }
            return acc;
        }, {});

        const newChatList = Object.values(conversations);
        setChatList(newChatList);

        // Tự động chọn chat đầu tiên nếu chưa có selectedChat
        if (newChatList.length > 0 && !selectedChat) {
            setSelectedChat(newChatList[0]);
        }
    };

    // Gọi getChatHistory khi mở chat hoặc khi messages thay đổi
    useEffect(() => {
        if (!request_id) {
            console.warn('No request_id found in localStorage');
            return;
        }

        if (isChatOpen && !isFetchingRef.current) {
            isFetchingRef.current = true;
            dispatch(getChatHistory(null, request_id)).finally(() => {
                isFetchingRef.current = false;
            });
        }
    }, [isChatOpen, dispatch, request_id]);

    // Xây dựng chatList khi messages thay đổi
    useEffect(() => {
        if (messages) {
            buildChatList(messages);
        }
    }, [messages, user_id]);

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
            const senderId = typeof message.senderId === 'object' ? message.senderId?._id : message.senderId;
            const receiverId = typeof message.receiverId === 'object' ? message.receiverId?._id : message.receiverId;

            if (senderId !== user_id && receiverId === user_id) {
                setHasNewMessages((prev) => ({
                    ...prev,
                    [senderId]: true,
                }));
                setHasNewMessageForIcon(true);

                if (!selectedChat) {
                    setSelectedChat({
                        id: senderId,
                        user: { name: `Thợ #${senderId.slice(-6)}`, role: 'repairman' },
                        lastMessage: message.message,
                        timestamp: message.timestamp,
                    });
                }

                if (!isFetchingRef.current) {
                    isFetchingRef.current = true;
                    dispatch(getChatHistory(null, request_id)).finally(() => {
                        isFetchingRef.current = false;
                    });
                }
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [user_id, dispatch, request_id, selectedChat]);

    const toggleChatDropdown = () => {
        setIsChatOpen(!isChatOpen);
        if (!isChatOpen && Object.values(hasNewMessages).some((hasNew) => hasNew)) {
            setHasNewMessageForIcon(false);
        }
    };

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        setHasNewMessages((prev) => ({
            ...prev,
            [chat.id]: false,
        }));
        const hasRemainingNewMessages = Object.values({
            ...hasNewMessages,
            [chat.id]: false,
        }).some((hasNew) => hasNew);
        if (!hasRemainingNewMessages) {
            setHasNewMessageForIcon(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() && selectedChat) {
            dispatch(sendMessage(selectedChat.id, messageInput, user_id, request_id));
            setMessageInput('');
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
            <div className="chat-icon-wrapper">
                <FaComments
                    className="chat-icon"
                    onClick={toggleChatDropdown}
                />
                {hasNewMessageForIcon && (
                    <span className="chat-notification-dot"></span>
                )}
            </div>
            {isChatOpen && (
                <div className="user-chat-popup">
                    <div className="user-chat-container">
                        <div className="user-chat-list">
                            <h3 className="user-chat-title">Tin nhắn</h3>
                            {loadingMessage && <p>Đang tải danh sách chat...</p>}
                            {!loadingMessage && chatList.length === 0 && <p className="user-chat-empty">Chưa có tin nhắn</p>}
                            {!loadingMessage && chatList.length > 0 && chatList.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`user-chat-item ${selectedChat?.id === chat.id ? 'user-chat-selected' : ''} ${hasNewMessages[chat.id] ? 'has-new-message' : ''}`}
                                    onClick={() => handleSelectChat(chat)}
                                >
                                    <div className="user-chat-info">
                                        <span className="user-chat-name">{chat.user.name}</span>
                                        <span className="user-chat-preview">{chat.lastMessage}</span>
                                    </div>
                                    <span className="user-chat-time">{formatMessageTime(chat.timestamp)}</span>
                                </div>
                            ))}
                        </div>
                        {selectedChat && (
                            <div className="user-chat-messages">
                                <div className="user-chat-header">
                                    <h3>{selectedChat.user.name}</h3>
                                </div>
                                <div className="user-chat-message-area">
                                    {/* {loadingMessage && <p>Đang tải tin nhắn...</p>} */}
                                    {!loadingMessage && messages.length === 0 && <p>Chưa có tin nhắn.</p>}
                                    {!loadingMessage && messages
                                        .filter((msg) => {
                                            const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
                                            const receiverId = typeof msg.receiverId === 'object' ? msg.receiverId?._id : msg.receiverId;
                                            return senderId === selectedChat.id || receiverId === selectedChat.id;
                                        })
                                        .map((message) => (
                                            <div
                                                key={message._id}
                                                className={`user-chat-message ${message.senderId?._id === user_id || message.senderId === user_id ? 'user-chat-sent' : 'user-chat-received'}`}
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