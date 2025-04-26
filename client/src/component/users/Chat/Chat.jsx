import React, { useState } from 'react';
import { FaComments } from 'react-icons/fa';
import './Chat.css';

const Chat = ({ role }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
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

    const toggleChatDropdown = () => {
        setIsChatOpen(!isChatOpen);
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

    const formatMessageTime = (timestamp) => {
        const d = new Date(timestamp);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="chat-container">
            <FaComments className="chat-icon" onClick={toggleChatDropdown} />
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
        </div>
    );
};

export default Chat;