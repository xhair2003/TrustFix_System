import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typewriterText, setTypewriterText] = useState({});
    const messagesEndRef = useRef(null);

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI('AIzaSyAbhlcIqk9EtQbuoOZQdhaPrQg5swExBK8'); // Replace with your valid API key
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // System Instructions for Gemini
    const systemInstructions = `
        Bạn là một trợ lý ảo tên là TrustFix Assistant, làm việc trong hệ thống web TrustFix.
        Vai trò của bạn là hỗ trợ người dùng, giải đáp thắc mắc và hướng dẫn người dùng sửa chữa chuyên sâu,...Còn những lĩnh vực khác thì từ chối trả lời 
        
        -Nếu người dùng hỏi cách đặt thợ (cách tìm thợ) thì đây là cách đặt thợ: 
        **Bước 1:** Chọn mục tìm thợ trên thanh điều hướng\n
        **Bước 2:** Nhập tình trạng sửa chữa, địa điểm sửa chữa, loại thợ, bán kính và tải lên hình ảnh của sản phẩm cần sửa và nhấn tìm kiếm\n 
        **Bước 3:** Sau khi tìm được thợ, hãy chờ để deal giá, sau khi deal giá, khi thành công hãy chờ một thời gian để thợ đến địa điểm của bạn\n
        **Bước 4:** Khi thợ hoàn thành đơn hàng, hãy nhấn xác nhận hoàn thành đơn hàng và đánh giá dịch vụ, Cảm ơn Bạn !!\n

        nếu người dùng hỏi cách sửa những đồ gì thì hãy hướng dẫn họ sửa theo tình trạng cung cấp, nếu họ bảo k sửa được thì hướng dẫn đặt thợ
        nếu có những câu hỏi mang tính đời thường thì vẫn trả lời được một cách thân thiện (hỏi về thời gian/hỏi về thông tin liên hệ/...)
    `;

    // Fetch bot reply from Gemini API
    const getBotReply = async (message) => {
        try {
            // Limit chat history to last 5 messages to avoid token limit
            const chatHistory = messages
                .slice(-5)
                .map((msg) => `${msg.sender === 'user' ? 'Người dùng' : 'TrustFix Assistant'}: ${msg.text}`)
                .join('\n');
            const prompt = `${systemInstructions}\n\nLịch sử trò chuyện:\n${chatHistory}\n\nNgười dùng: ${message}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Lỗi Gemini API:', error.message, error.stack);
            return 'Có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.';
        }
    };

    // Welcome message on mount
    useEffect(() => {
        if (messages.length === 0) {
            const welcomeMessage = {
                text: 'Xin chào! Tôi là TrustFix Assistant. Rất vui được hỗ trợ bạn tìm thợ sửa chữa đáng tin cậy hôm nay! Bạn khỏe không? Có gì cần sửa chữa không? 😊',
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([welcomeMessage]);
            setTypewriterText({ 0: '' });
        }
    }, []);

    // Scroll to bottom on new messages or typewriter updates
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typewriterText]);

    // Typewriter effect for bot messages
    useEffect(() => {
        messages.forEach((msg, index) => {
            if (msg.sender === 'bot' && typewriterText[index] === undefined) {
                console.log(`Starting typewriter for message ${index}: ${msg.text.slice(0, 20)}...`);
                let currentText = '';
                const fullText = msg.text;
                setTypewriterText((prev) => ({ ...prev, [index]: '' }));

                const interval = setInterval(() => {
                    if (currentText.length < fullText.length) {
                        currentText = fullText.slice(0, currentText.length + 1);
                        setTypewriterText((prev) => ({ ...prev, [index]: currentText }));
                    } else {
                        console.log(`Finished typewriter for message ${index}`);
                        clearInterval(interval);
                    }
                }, 20); // 20ms per character

                return () => clearInterval(interval);
            }
        });
    }, [messages, typewriterText]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, userMessage]);
        setInput('');
        setIsTyping(true);

        const botReplyText = await getBotReply(input);
        setIsTyping(false);

        const botMessage = {
            text: botReplyText,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chatbot-page-container">
            <div className="chatbot-page-window">
                <div className="chatbot-header">
                    <span className="header-title">TrustFix Assistant</span>
                </div>
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}-message`}>
                            <div className="message-content">
                                {msg.sender === 'bot' ? (
                                    <ReactMarkdown>
                                        {typewriterText[index] !== undefined ? typewriterText[index] : msg.text}
                                    </ReactMarkdown>
                                ) : (
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                )}
                            </div>
                            <div className="message-time">{msg.time}</div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message bot-message typing-indicator">
                            <div className="message-content">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chatbot-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn..."
                    />
                    <button onClick={handleSendMessage}>➤</button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
