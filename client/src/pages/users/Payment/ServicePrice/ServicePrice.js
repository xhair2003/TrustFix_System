import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllVips } from '../../../../store/actions/userActions';
import { useNavigate } from "react-router-dom";
import './ServicePrice.css';
import Loading from "../../../../component/Loading/Loading";

const ServicePrice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { vips, loading, error } = useSelector((state) => state.user);
    const [typeServices, setTypeServices] = useState([]);

    useEffect(() => {
        dispatch(fetchAllVips());
    }, [dispatch]);

    //console.log(vips);

    useEffect(() => {
        if (!loading && vips.length > 0) {
            setTypeServices(vips);
        }
    }, [loading, vips]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="sp-container">
            <div className="sp-content-wrapper">
                <div className="sp-header">
                    <h2 className="sp-title">Bảng Giá Dịch Vụ Tăng Đề Xuất</h2>
                    <p className="sp-subtitle">Chọn phương án hoàn hảo cho nhu cầu của bạn</p>
                </div>

                <div className="sp-grid">
                    {typeServices.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            className="sp-card"
                        >
                            <div className="sp-card-content">
                                {/* <h3 className="sp-card-title">{item.name}</h3> */}
                                <h3 className="sp-card-title">{item.description}</h3>
                                <div className="sp-price-wrapper">
                                    <span className="sp-price">
                                        {new Intl.NumberFormat("vi-VN").format(item.price)}
                                    </span>
                                    <span className="sp-unit">VNĐ đồng</span>
                                </div>

                                <div className="sp-features">
                                    {item.description.split(".").filter(sentence => sentence.trim() !== "").map((sentence, index) => (
                                        <div key={index} className="sp-feature-item">
                                            <FiCheckCircle className="sp-feature-icon" />
                                            <span className="sp-feature-text">{sentence.trim()}</span>
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    onClick={() => {
                                        navigate("buy-recommend-booking-package", { state: { selectedTypePostId: item._id } });
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