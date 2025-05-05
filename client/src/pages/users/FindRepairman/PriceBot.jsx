import React, { useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PriceBot = ({ description, onPriceResponse }) => {
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI('AIzaSyAbhlcIqk9EtQbuoOZQdhaPrQg5swExBK8'); // Replace with valid API key
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // System Instructions for Gemini
    const systemInstructions = `Không trả lời bất cứ thứ gì, câu trả lời chỉ đơn giản là đưa ra mức giá theo format: " ....... vnd - ....... vnd (đúng 98% so với thị trường) "nếu không trả lời được thì trả lời là: "Bạn nên trao đổi với thợ để có mức giá chính xác" còn lại ko nói cái gì hết
            data về giá: 
                Tủ lạnh: 300.000 - 700.000  
                Máy giặt: 350.000 - 800.000  
                Máy lạnh: 400. priceBot.jsx000 - 1.000.000  
                Quạt điện: 100.000 - 250.000  
                Sửa khóa: 150.000 - 400.000  
                Bếp ga: 200.000 - 500.000  
                Máy nước nóng: 300.000 - 700.000  
                Máy hút bụi: 300.000 - 600.000  
                Lò vi sóng: 200.000 - 400.000  
                Máy lọc nước: 250.000 - 600.000  
                Bình đun siêu tốc: 100.000 - 200.000  
                Máy sấy tóc: 80.000 - 150.000  
                Máy ép trái cây: 200.000 - 400.000  
                Máy xay sinh tố: 150.000 - 300.000  
                Máy pha cà phê: 300.000 - 600.000  
                Bếp từ: 400.000 - 800.000  
                Máy chiếu: 500.000 - 1.000.000  
                Máy in: 400.000 - 900.000  
                Tivi: 500.000 - 1.200.000  
                Âm ly/loa: 300.000 - 800.000  
                Camera an ninh: 250.000 - 600.000  
                Cửa cuốn: 500.000 - 1.200.000  
                Máy tính bàn: 400.000 - 1.000.000  
                Laptop: 600.000 - 1.500.000  
                Điện thoại: 400.000 - 1.000.000  
                Router/modem WiFi: 150.000 - 300.000  
                Bàn ủi: 100.000 - 200.000  
                Máy khoan: 200.000 - 400.000  
                Máy bơm nước: 300.000 - 700.000  
                Máy cắt cỏ: 400.000 - 900.000 
        `;

    // Fetch price from Gemini API
    const getPrice = async (message) => {
        try {
            const prompt = `${systemInstructions}\n\nNgười dùng: ${message}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Lỗi Gemini API:', error.message, error.stack);
            return 'Có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.';
        }
    };

    // Process description when received
    useEffect(() => {
        if (description) {
            getPrice(description).then((price) => {
                onPriceResponse(price);
            });
        }
    }, [description]);

    // No UI rendering, as PriceBot is now a logic component
    return null;
};

export default PriceBot;