import React, { useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PriceBot = ({ description, onPriceResponse }) => {
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI('AIzaSyAbhlcIqk9EtQbuoOZQdhaPrQg5swExBK8'); // Replace with valid API key
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // System Instructions for Gemini
    const systemInstructions = `Không trả lời bất cứ thứ gì, câu trả lời chỉ đơn giản là đưa ra mức giá theo format: " ....... vnd - ....... vnd " nếu không trả lời được thì trả lời là: "-1" còn lại ko nói cái gì hết
        `;

    // Parse price response to extract minPrice and maxPrice as floats
    const parsePrice = (priceText) => {
        if (priceText === '-1') {
            return { minPrice: -1, maxPrice: -1 };
        }

        // Remove 'vnd' and split by ' - '
        const cleanedText = priceText.replace(' vnd', '').replace(/\./g, '');
        const [minPriceStr, maxPriceStr] = cleanedText.split(' - ');

        // Convert to float
        const minPrice = parseFloat(minPriceStr);
        const maxPrice = parseFloat(maxPriceStr);

        // Validate numbers
        if (isNaN(minPrice) || isNaN(maxPrice)) {
            return { minPrice: -1, maxPrice: -1 };
        }

        return { minPrice, maxPrice };
    };

    // Fetch price from Gemini API
    const getPrice = async (message) => {
        try {
            const prompt = `${systemInstructions}\n\nNgười dùng: ${message}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Lỗi Gemini API:', error.message, error.stack);
            return '-1'; // Return -1 for errors
        }
    };

    // Process description when received
    useEffect(() => {
        if (description) {
            getPrice(description).then((priceText) => {
                const { minPrice, maxPrice } = parsePrice(priceText);
                onPriceResponse({ minPrice, maxPrice });
            });
        }
    }, [description]);

    // No UI rendering, as PriceBot is now a logic component
    return null;
};

export default PriceBot;