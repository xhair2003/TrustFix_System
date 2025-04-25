// import React, { useState, useEffect, useRef } from 'react';
// import './ChatBot.css';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

// const ChatBot = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const [isTyping, setIsTyping] = useState(false); // Trạng thái typing indicator
//     const messagesEndRef = useRef(null);

//     // Khởi tạo Gemini API
//     const genAI = new GoogleGenerativeAI('AIzaSyAbhlcIqk9EtQbuoOZQdhaPrQg5swExBK8');
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//     // System Instructions dành cho Gemini
//     const systemInstructions = `
//         Bạn là một trợ lý ảo tên là TrustFix Assistant, làm việc trong hệ thống web TrustFix.
//         Vai trò của bạn là hỗ trợ người dùng, giải đáp thắc mắc và hướng dẫn người dùng sửa chữa chuyên sâu,...Còn những lĩnh vực khác thì từ chối trả lời 
        
//         -Nếu người dùng hỏi cách đặt thợ (cách tìm thợ) thì đây là cách đặt thợ: 
//         **Bước 1:** Chọn mục tìm thợ trên thanh điều hướng\n
//         **Bước 2:** Nhập tình trạng sửa chữa, địa điểm sửa chữa, loại thợ, bán kính và tải lên hình ảnh của sản phẩm cần sửa và nhấn tìm kiếm\n 
//         **Bước 3:** Sau khi tìm được thợ, hãy chờ để deal giá, sau khi deal giá, khi thành công hãy chờ một thời gian để thợ đến địa điểm của bạn\n
//         **Bước 4:** Khi thợ hoàn thành đơn hàng, hãy nhấn xác nhận hoàn thành đơn hàng và đánh giá dịch vụ, Cảm ơn Bạn !!\n 

//         nếu người dùng hỏi cách sửa những đồ gì thì hãy hướng dẫn họ sửa theo tình trạng cung cấp, nếu họ bảo k sửa được thì hướng dẫn đặt thợ
//         nếu có những câu hỏi mang tính đời thường thì vẫn trả lời được một cách thân thiện (hỏi về thời gian/hỏi về thông tin liên hệ/...


//         CSKH: 0989237187 - thời gian làm việc từ 7h - 22h

//     `;

//     // Hàm lấy phản hồi từ Gemini API
//     const getBotReply = async (message) => {
//         try {
//             // Tạo lịch sử tin nhắn từ mảng messages
//             const chatHistory = messages
//                 .map((msg) => `${msg.sender === 'user' ? 'Người dùng' : 'TrustFix Assistant'}: ${msg.text}`)
//                 .join('\n');
            
//             // Kết hợp lịch sử tin nhắn, system instructions và tin nhắn mới
//             const prompt = `${systemInstructions}\n\nLịch sử trò chuyện:\n${chatHistory}\n\nNgười dùng: ${message}`;
//             const result = await model.generateContent(prompt);
//             const response = await result.response;
//             return response.text();
//         } catch (error) {
//             console.error('Lỗi Gemini API:', error);
//             return 'Có lỗi xảy ra khi xử lý yêu cầu của bạn.';
//         }
//     };

//     // Thêm lời chào khi mở chatbot
//     useEffect(() => {
//         if (messages.length === 0) {
//             const welcomeMessage = {
//                 text: 'Xin chào! Tôi là TrustFix Assistant. Rất vui được hỗ trợ bạn tìm thợ sửa chữa! Bạn khỏe không? Có sửa chữa không người đẹp? 😊',
//                 sender: 'bot',
//                 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             };
//             setMessages([welcomeMessage]);
//         }
//     }, []);

//     // Scroll xuống cuối khi có tin nhắn mới
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     const handleSendMessage = async () => {
//         if (!input.trim()) return;

//         const userMessage = {
//             text: input,
//             sender: 'user',
//             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         };
//         setMessages([...messages, userMessage]);
//         setInput('');
//         setIsTyping(true); // Hiển thị typing indicator

//         const botReplyText = await getBotReply(input);
//         setIsTyping(false); // Ẩn typing indicator sau khi nhận phản hồi

//         const botMessage = {
//             text: botReplyText,
//             sender: 'bot',
//             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         };
//         setMessages((prev) => [...prev, botMessage]);
//     };

//     // Xử lý nhấn Enter để gửi tin nhắn
//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             handleSendMessage();
//         }
//     };

//     return (
//         <div className="chatbot-page-container">
//             <div className="chatbot-page-window">
//                 <div className="chatbot-header">
//                     <span className="header-title">TrustFix Assistant</span>
//                 </div>
//                 <div className="chatbot-messages">
//                     {messages.map((msg, index) => (
//                         <div key={index} className={`message ${msg.sender}-message`}>
//                             <div className="message-content">
//                                 <ReactMarkdown>{msg.text}</ReactMarkdown> {/* Sử dụng ReactMarkdown */}
//                             </div>
//                             <div className="message-time">{msg.time}</div>
//                         </div>
//                     ))}
//                     {isTyping && (
//                         <div className="message bot-message typing-indicator">
//                             <div className="message-content">
//                                 <div className="typing-dot"></div>
//                                 <div className="typing-dot"></div>
//                                 <div className="typing-dot"></div>
//                             </div>
//                         </div>
//                     )}
//                     <div ref={messagesEndRef} />
//                 </div>
//                 <div className="chatbot-input-area">
//                     <input
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Nhập tin nhắn..."
//                     />
//                     <button onClick={handleSendMessage}>➤</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChatBot;


import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';


const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typewriterText, setTypewriterText] = useState({});
    const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI('AIzaSyAbhlcIqk9EtQbuoOZQdhaPrQg5swExBK8'); // Replace with valid API key
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // System Instructions dành cho Gemini
    const systemInstructions = ` hông trả lời bất cứ thứ gì, câu trả lời chỉ đơn giản là đưa ra mức giá theo format: ....... vnd - ....... vnd nếu không trả lời được thì trả lời là: "EM" còn lại ko nói cái gì hết

                data: 
                Tủ lạnh - Không lạnh, xì gas, hư block - 200.000 – 800.000 VNĐ
                TV - Hư nguồn, bo mạch, lỗi màn hình - 300.000 – 1.200.000 VNĐ
                Khóa cửa - Mất chìa, kẹt khóa, thay ổ khóa - 100.000 – 500.000 VNĐ
                Máy giặt - Không vắt, lỗi mạch, kêu to - 250.000 – 900.000 VNĐ
                Máy lạnh - Không lạnh, hết gas, lỗi bo - 300.000 – 1.000.000 VNĐ
                Quạt điện - Không quay, kêu to, cháy tụ - 100.000 – 300.000 VNĐ
                Lò vi sóng - Không nóng, lỗi mạch, cháy bóng - 200.000 – 600.000 VNĐ
                Bình nóng lạnh - Không nóng, rò điện, hư cảm biến - 200.000 – 700.000 VNĐ
                Ổ điện - Lỏng ổ, không lên điện - 150.000 – 400.000 VNĐ
                Dây điện âm tường - Chập cháy, đứt dây - 200.000 – 600.000 VNĐ
                Bếp điện - Không nóng, hư mạch - 300.000 – 1.000.000 VNĐ
                Bếp từ - Không nhận nồi, lỗi cảm biến - 400.000 – 1.200.000 VNĐ
                Máy bơm nước - Không lên nước, kêu to - 250.000 – 800.000 VNĐ
                Máy hút bụi - Không hút, hỏng motor - 200.000 – 600.000 VNĐ
                Camera giám sát - Không lên hình, hư đầu ghi - 300.000 – 1.000.000 VNĐ
                Máy tính bàn - Không lên nguồn, lỗi phần mềm - 300.000 – 1.200.000 VNĐ
                Laptop - Màn hình đen, lỗi ổ cứng - 400.000 – 1.500.000 VNĐ
                Điện thoại - Không sạc được, vỡ màn hình - 300.000 – 1.500.000 VNĐ
                Máy in - Kẹt giấy, không in được - 300.000 – 900.000 VNĐ
                Router Wi-Fi - Không phát sóng, hư nguồn - 200.000 – 500.000 VNĐ
                Laptop - Màn hình xanh - 100.000 – 500.000 VNĐ
        `
    
    


    // Fetch bot reply from Gemini API
    const getBotReply = async (message) => {
        try {
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


    // Typewriter effect for bot messages
    useEffect(() => {
        messages.forEach((msg, index) => {
            if (msg.sender === 'bot' && typewriterText[index] === '') {
                console.log(`Starting typewriter for message ${index}: ${msg.text.slice(0, 20)}...`);
                let currentText = '';
                const fullText = msg.text;

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

    // Scroll to bottom only after user sends a message
    useEffect(() => {
        console.log('Messages updated:', messages, 'Has user sent message:', hasUserSentMessage);
        if (hasUserSentMessage) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, typewriterText, hasUserSentMessage]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        setHasUserSentMessage(true); // Enable scrolling after user sends message

        const botReplyText = await getBotReply(input);
        setIsTyping(false);

        const botMessage = {
            text: botReplyText,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => {
            const newMessages = [...prev, botMessage];
            setTypewriterText((prevText) => ({ ...prevText, [newMessages.length - 1]: '' }));
            return newMessages;
        });
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
                                        {typewriterText[index] || msg.text}
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