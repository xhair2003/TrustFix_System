import React, { useEffect, useState } from "react";
import "./UpgradeRepairman.css";
import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from "../../../services/Address.js";

const UpgradeRepairman = () => {
    const [address, setAddress] = useState("");
    const [ward, setWard] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [workerType, setWorkerType] = useState("");
    const [description, setDescription] = useState("");
    const [idCard, setIdCard] = useState(null);
    const [certification, setCertification] = useState(null);

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await apiGetPubliccitys();
                setCities(response?.data.results);
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (!city) {
                setDistrict("");
                setDistricts([]);
                return;
            }
            try {
                const response = await apiGetPublicDistrict(city);
                if (response.status === 200) {
                    setDistricts(response.data?.results);
                }
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        };
        fetchDistricts();
    }, [city]);

    useEffect(() => {
        const fetchWards = async () => {
            if (!district) {
                setWard("");
                setWards([]);
                return;
            }
            try {
                const response = await apiGetPublicWard(district);
                if (response.status === 200) {
                    setWards(response.data?.results);
                }
            } catch (error) {
                console.error("Error fetching wards:", error);
            }
        };
        fetchWards();
    }, [district]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Yêu cầu nâng cấp đã được gửi:", {
            address,
            ward,
            district,
            city,
            workerType,
            description,
            idCard,
            certification,
        });
    };

    return (
        <div className="upgrade-repairman-form">
            <h1 className="form-title">Gửi yêu cầu nâng cấp lên thợ</h1>
            <form onSubmit={handleSubmit}>
                <div >
                    <h2 className="section-title">Thông tin cá nhân</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Họ và Tên</label>
                            <input
                                type="text"
                                value="Nguyễn Văn A"
                                readOnly
                                className="form-input readonly"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                value="nguyenvana@example.com"
                                readOnly
                                className="form-input readonly"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Số điện thoại</label>
                            <input
                                type="tel"
                                value="0123456789"
                                readOnly
                                className="form-input readonly"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Thông tin địa chỉ</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Địa chỉ</label>
                            <input
                                type="text"
                                placeholder="Số nhà, tên đường"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tỉnh/thành phố</label>
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                                className="form-select"
                            >
                                <option value="">Chọn tỉnh/thành phố</option>
                                {cities.map((city) => (
                                    <option key={city.province_id} value={city.province_id}>
                                        {city.province_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Quận/huyện</label>
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                required
                                className="form-select"
                            >
                                <option value="">Chọn quận/huyện</option>
                                {districts.map((district) => (
                                    <option key={district.district_id} value={district.district_id}>
                                        {district.district_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phường/xã</label>
                            <select
                                value={ward}
                                onChange={(e) => setWard(e.target.value)}
                                required
                                className="form-select"
                            >
                                <option value="">Chọn phường/xã</option>
                                {wards.map((ward) => (
                                    <option key={ward.ward_id} value={ward.ward_id}>
                                        {ward.ward_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Thông tin nghề nghiệp</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Loại thợ muốn làm</label>
                            <select
                                value={workerType}
                                onChange={(e) => setWorkerType(e.target.value)}
                                required
                                className="form-select"
                            >
                                <option value="">Chọn loại thợ</option>
                                <option value="workerType1">Thợ loại 1</option>
                                <option value="workerType2">Thợ loại 2</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tải ảnh căn cước công dân</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setIdCard(e.target.files[0])}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tải ảnh giấy tờ chứng chỉ hành nghề</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCertification(e.target.files[0])}
                                required
                                className="form-input"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Mô tả về bạn</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows="4"
                                placeholder="Mô tả chi tiết về bản thân bạn..."
                                style={{
                                    width: '99%', // Đảm bảo độ rộng đầy đủ
                                    minHeight: '40px', // Chiều cao ngắn hơn
                                    padding: '0.5rem', // Padding bên trong
                                    border: '1px solid #d1d5db', // Đường viền
                                    borderRadius: '0.375rem', // Bo góc
                                    outline: 'none', // Không có viền khi focus
                                    transition: 'border-color 0.2s, box-shadow 0.2s', // Hiệu ứng chuyển tiếp
                                }}
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="submit-btn">Gửi yêu cầu</button>
            </form>
        </div>
    );
};

export default UpgradeRepairman;