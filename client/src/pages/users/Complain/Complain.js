import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { submitComplaint, resetError, resetSuccess } from '../../../store/actions/userActions';
import "./Complain.css";
import Loading from "../../../component/Loading/Loading";
import Swal from 'sweetalert2';

const Complain = () => {
    const dispatch = useDispatch();
    const { loading, complaintMessage, complaintError } = useSelector((state) => state.user);
    console.log(complaintMessage);
    console.log(complaintError);
    const [requestId, setRequestId] = useState("");
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [evidence, setEvidence] = useState(null);
    const [resolution, setResolution] = useState("");
    const [compensation, setCompensation] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetError());
        dispatch(resetSuccess());
        const complaintData = {
            request_id: requestId,
            complaintType: reason,
            complaintContent: details,
            requestResolution: resolution,
            image: evidence || null,
        };
        console.log(complaintData);
        dispatch(submitComplaint(complaintData));
    };

    useEffect(() => {
        if (complaintMessage) {
            Swal.fire({
                title: "Thành công",
                icon: "success",
                text: complaintMessage,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
        else if (complaintError) {
            Swal.fire({
                title: "Lỗi",
                icon: "error",
                text: complaintError,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    }, [complaintMessage, complaintError]);

    if (loading) {
        return <Loading />;
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra định dạng file
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert('Vui lòng chỉ upload ảnh định dạng JPG, PNG hoặc JPEG!');
                return; // Ngừng thực hiện nếu định dạng không hợp lệ
            }

            setEvidence(file); // Lưu file vào state
        }
    };

    return (
        <div className="complaint-container">
            <div className="complaint-content">
                <h2 className="complaint-title">KHIẾU NẠI ĐƠN SỬA CHỮA</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h3 className="section-title">Thông tin đơn sửa chữa</h3>
                        <div className="booking-info-section">
                            <div className="form-group">
                                <label>Mã đơn:</label>
                                <input
                                    type="text"
                                    value={requestId}
                                    onChange={(e) => setRequestId(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Tên thợ:</label>
                                <input type="text" value={'Hoành'} readOnly className="form-input readonly" />
                            </div>
                            <div className="form-group">
                                <label>Ngày hoàn thành:</label>
                                <input type="text" value={'1 / 2'} readOnly className="form-input readonly" />
                            </div>
                        </div>
                    </div>

                    <div className="main-content-section">
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
                                    <option value="Chất lượng sửa chữa không đạt">Chất lượng sửa chữa không đạt</option>
                                    <option value="Thợ đến muộn/không đến">Thợ đến muộn/không đến</option>
                                    <option value="Thái độ không chuyên nghiệp">Thái độ không chuyên nghiệp</option>
                                    <option value="Khác">Khác</option>
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

                        <div className="evidence-resolution-section">
                            <div className="section">
                                <h3 className="section-title">Bằng chứng</h3>
                                <div className="form-group">
                                    <label>Tải lên hình ảnh:</label>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleImageUpload}
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
                                        <option value="Hoàn tiền">Hoàn tiền</option>
                                        <option value="Sửa chữa lại">Sửa chữa lại</option>
                                        <option value="Đền bù thiệt hại">Đền bù thiệt hại</option>
                                        <option value="Khác">Khác</option>
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

export default Complain;