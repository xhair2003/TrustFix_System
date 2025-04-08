import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Khởi tạo Gemini API
    const genAI = new GoogleGenerativeAI('AIzaSyAbhlcIqk9EtQbuoOZQdhaPrQg5swExBK8');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Hàm lấy phản hồi từ Gemini API
    const getBotReply = async (message) => {
        try {
            const result = await model.generateContent(message);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Lỗi Gemini API:', error);
            return 'Có lỗi xảy ra khi xử lý yêu cầu của bạn.';
        }
    };

    // Scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, userMessage]);
        setInput('');

        const botReplyText = await getBotReply(input);
        const botMessage = {
            text: botReplyText,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
                💬
            </div>
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        ChatBot
                        <span className="close-btn" onClick={() => setIsOpen(false)}>
                            ×
                        </span>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}-message`}>
                                <div className="message-content">{msg.text}</div>
                                <div className="message-time">{msg.time}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chatbot-input-area">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Nhập tin nhắn..."
                        />
                        <button onClick={handleSendMessage}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;