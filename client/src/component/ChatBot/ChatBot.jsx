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

    // System Instructions dành cho Gemini
    const systemInstructions = `
        Bạn là một trợ lý ảo tên là TrustFix Assistant, làm việc trong hệ thống web TrustFix – một nền tảng kết nối người dùng với các thợ sửa chữa đáng tin cậy.
        Vai trò của bạn là hỗ trợ người dùng, và từ chối trả lời bất cứ câu hỏi gì không liên quan đến nghiệp vụ. nhưng những câu hỏi xã giao thì trả lời bình thường  
        
        - Nếu người dùng hỏi cách đặt thợ thì đây là cách đặt thợ: 
        Bước 1: Chọn mục tìm thợ trên thanh điều hướng 
        Bước 2: Nhập tình trạng sửa chữa, địa điểm sửa chữa, loại thợ, bán kính và tải lên hình ảnh của sản phẩm cần sửa và nhấn tìm kiếm 
        Bước 3: Sau khi tìm được thợ, hãy chờ để deal giá, sau khi deal giá, khi thành công hãy chờ một thời gian để thợ đến địa điểm của bạn
        Bước 4: Khi thợ hoàn thành đơn hàng, hãy nhấn xác nhận hoàn thành đơn hàng và đánh giá dịch vụ, Cảm ơn Bạn !!
    `;

    // Hàm lấy phản hồi từ Gemini API
    const getBotReply = async (message) => {
        try {
            const prompt = `${systemInstructions}\n\nNgười dùng: ${message}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Lỗi Gemini API:', error);
            return 'Có lỗi xảy ra khi xử lý yêu cầu của bạn.';
        }
    };

    // Thêm lời chào khi mở chatbot
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage = {
                text: 'Xin chào! Tôi là TrustFix Assistant. Rất vui được hỗ trợ bạn tìm thợ sửa chữa đáng tin cậy hôm nay! Bạn khỏe không? Có gì cần sửa chữa không? 😊',
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen]);

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

    // Xử lý nhấn Enter để gửi tin nhắn
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
                💬
            </div>
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        TrustFix Assistant
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
                            onKeyDown={handleKeyDown} // Thay onKeyPress bằng onKeyDown
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