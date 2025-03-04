import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
//import { useSelector } from "react-redux";
//import axios from "axios";
import { useNavigate } from "react-router-dom";
import './ServicePrice.css';

// Dữ liệu giả để test UI
const mockTypePosts = [
    {
        id: 1,
        name: "Gói 1 tháng",
        price: 50000,
        desc: "Đăng tin cơ bản. Hiển thị trong 24 giờ. Tiếp cận 1000 người dùng.",
    },
    {
        id: 2,
        name: "Gói 3 tháng",
        price: 150000,
        desc: "Giảm 20%. Đăng tin nổi bật. Hiển thị trong 3 ngày. Tiếp cận 5000 người dùng.",
    },
    {
        id: 3,
        name: "Gói 12 tháng",
        price: 300000,
        desc: "Giảm 40%. Đăng tin VIP. Hiển thị trong 7 ngày. Tiếp cận 20000 người dùng.",
    },
];

const ServicePrice = () => {
    const navigate = useNavigate();
    //const { token } = useSelector((state) => state.auth);
    const [typePosts, setTypePosts] = useState(mockTypePosts); // Sử dụng dữ liệu giả ban đầu

    // const fetchTypePost = async () => {
    //     try {
    //         const res = await axios.get("http://localhost:5000/api/v1/admin/showAllTypePost", {
    //             headers: {
    //                 token: `${token}`,
    //             },
    //         });
    //         if (res.data.err === 0) {
    //             setTypePosts(res.data.postType);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching typePosts:", error);
    //     }
    // };

    useEffect(() => {
        // fetchTypePost(); // Chú thích lại để dùng dữ liệu giả, bỏ comment khi muốn gọi API thật
    }, []);

    return (
        <div className="sp-container">
            <div className="sp-content-wrapper">
                <div className="sp-header">
                    <h2 className="sp-title">Bảng Giá Dịch Vụ Tăng Đề Xuất</h2>
                    <p className="sp-subtitle">Chọn phương án hoàn hảo cho nhu cầu của bạn</p>
                </div>

                <div className="sp-grid">
                    {typePosts.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            className="sp-card"
                        >
                            <div className="sp-card-content">
                                <h3 className="sp-card-title">{item.name}</h3>
                                <div className="sp-price-wrapper">
                                    <span className="sp-price">
                                        {new Intl.NumberFormat("vi-VN").format(item.price)}
                                    </span>
                                    <span className="sp-unit">VNĐ đồng</span>
                                </div>

                                <div className="sp-features">
                                    {item.desc.split(".").filter(sentence => sentence.trim() !== "").map((sentence, index) => (
                                        <div key={index} className="sp-feature-item">
                                            <FiCheckCircle className="sp-feature-icon" />
                                            <span className="sp-feature-text">{sentence.trim()}</span>
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    onClick={() => {
                                        navigate("buy-recommend-booking-package", { state: { selectedTypePostId: item.id } });
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="sp-button"
                                >
                                    Áp dụng ngay
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicePrice;