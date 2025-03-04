import React, { useState } from "react";
import "./Complain.css";

const Complain = ({ bookingId, repairmanName, completionDate }) => {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [evidence, setEvidence] = useState([]);
    const [resolution, setResolution] = useState("");
    const [compensation, setCompensation] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting complaint:", { reason, details, evidence, resolution, compensation });
    };

    return (
        <div className="complaint-container">
            <div className="complaint-content">
                <h2 className="complaint-title">KHIẾU NẠI ĐƠN SỬA CHỮA</h2>
                <form onSubmit={handleSubmit}>
                    {/* Thông tin đơn hàng - Hiển thị trên 1 dòng */}
                    <div>
                        <h3 className="section-title">Thông tin đơn sửa chữa</h3>
                        <div className="booking-info-section">
                            <div className="form-group">
                                <label>Mã đơn:</label>
                                <input type="text" value={bookingId} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>Tên thợ:</label>
                                <input type="text" value={repairmanName} readOnly className="form-input readonly" />
                            </div>
                            <div className="form-group">
                                <label>Ngày hoàn thành:</label>
                                <input type="text" value={completionDate} readOnly className="form-input readonly" />
                            </div>
                        </div>

                    </div>

                    {/* Khối chia 2 phần: Lý do khiếu nại (70%) và Bằng chứng + Yêu cầu giải quyết (30%) */}
                    <div className="main-content-section">
                        {/* Phần bên trái - Lý do khiếu nại */}
                        <div className="complaint-reason-section">
                            <h3 className="section-title">Lý do khiếu nại</h3>
                            <div className="form-group">
                                <label>Lý do chính:</label>
                                <select
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Chọn lý do</option>
                                    <option value="poor_quality">Chất lượng sửa chữa không đạt</option>
                                    <option value="late">Thợ đến muộn/không đến</option>
                                    <option value="attitude">Thái độ không chuyên nghiệp</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Chi tiết khiếu nại:</label>
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    className="form-textarea"
                                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                                    required
                                />
                            </div>
                        </div>

                        {/* Phần bên phải - Bằng chứng và Yêu cầu giải quyết */}
                        <div className="evidence-resolution-section">
                            <div className="section">
                                <h3 className="section-title">Bằng chứng</h3>
                                <div className="form-group">
                                    <label>Tải lên hình ảnh/video:</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={(e) => setEvidence([...e.target.files])}
                                        className="form-input"
                                        style={{ maxWidth: '320px' }}
                                    />
                                </div>
                            </div>

                            <div className="section">
                                <h3 className="section-title">Yêu cầu giải quyết</h3>
                                <div className="form-group">
                                    <label>Mong muốn:</label>
                                    <select
                                        value={resolution}
                                        onChange={(e) => setResolution(e.target.value)}
                                        className="form-input"
                                        style={{ maxWidth: '320px' }}
                                        required
                                    >
                                        <option value="">Chọn yêu cầu</option>
                                        <option value="refund">Hoàn tiền</option>
                                        <option value="repair_again">Sửa chữa lại</option>
                                        <option value="compensation">Đền bù thiệt hại</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                                {resolution === "compensation" && (
                                    <div className="form-group">
                                        <label>Số tiền đền bù (VNĐ):</label>
                                        <input
                                            type="number"
                                            value={compensation}
                                            onChange={(e) => setCompensation(e.target.value)}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Xác nhận */}
                    <div className="confirmation-section">
                        <label className="confirmation">
                            <input
                                type="checkbox"
                                checked={isConfirmed}
                                onChange={(e) => setIsConfirmed(e.target.checked)}
                                required
                            />
                            Tôi xác nhận thông tin cung cấp là chính xác và đồng ý với{" "}
                            <a href="/terms" className="terms-link">điều khoản xử lý khiếu nại</a>.
                        </label>
                    </div>

                    {/* Nút gửi */}
                    <div className="submit-section">
                        <button type="submit" className="submit-btn" disabled={!isConfirmed}>
                            Gửi khiếu nại
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Ví dụ dữ liệu để test
Complain.defaultProps = {
    bookingId: "BK12345",
    repairmanName: "Nguyễn Văn A",
    completionDate: "2025-03-01",
};

export default Complain;