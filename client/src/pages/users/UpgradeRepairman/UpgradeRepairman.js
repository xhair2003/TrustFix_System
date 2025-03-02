import React, { useEffect, useState } from 'react';
import './UpgradeRepairman.css';
import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from '../../../services/Address.js';

const UpgradeRepairman = () => {
    const [address, setAddress] = useState('');
    const [ward, setWard] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [workerType, setWorkerType] = useState('');
    const [description, setDescription] = useState('');
    const [idCard, setIdCard] = useState(null);
    const [certification, setCertification] = useState(null);

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [detailAddress, setDetailAddress] = useState('');

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await apiGetPubliccitys();
                setCities(response?.data.results);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (!city) {
                setDistrict('');
                setDistricts([]);
                return;
            }
            try {
                const response = await apiGetPublicDistrict(city);
                if (response.status === 200) {
                    setDistricts(response.data?.results);
                }
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        };
        fetchDistricts();
    }, [city]);

    useEffect(() => {
        const fetchWards = async () => {
            if (!district) {
                setWard('');
                setWards([]);
                return;
            }
            try {
                const response = await apiGetPublicWard(district);
                if (response.status === 200) {
                    setWards(response.data?.results);
                }
            } catch (error) {
                console.error('Error fetching wards:', error);
            }
        };
        fetchWards();
    }, [district]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý gửi yêu cầu nâng cấp ở đây
        console.log('Yêu cầu nâng cấp đã được gửi:', {
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
            <h1>Gửi yêu cầu nâng cấp lên thợ</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label className="label-upgrade">Họ và Tên</label>
                        <input type="text" value="Nguyễn Văn A" readOnly />
                    </div>
                    <div className="form-group">
                        <label className="label-upgrade">Email</label>
                        <input type="email" value="nguyenvana@example.com" readOnly />
                    </div>
                    <div className="form-group">
                        <label className="label-upgrade">Số điện thoại</label>
                        <input type="tel" value="0123456789" readOnly />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="label-upgrade">Địa chỉ</label>
                        <input
                            type="text"
                            placeholder="Số nhà, tên đường"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="label-upgrade">Phường/xã</label>
                        <select value={ward} onChange={(e) => setWard(e.target.value)} required>
                            <option value="">Chọn phường/xã</option>
                            {wards.map((ward) => (
                                <option key={ward.ward_id} value={ward.ward_id}>{ward.ward_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label-upgrade">Quận/huyện</label>
                        <select value={district} onChange={(e) => setDistrict(e.target.value)} required>
                            <option value="">Chọn quận/huyện</option>
                            {districts.map((district) => (
                                <option key={district.district_id} value={district.district_id}>{district.district_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label-upgrade">Tỉnh/thành phố</label>
                        <select value={city} onChange={(e) => setCity(e.target.value)} required>
                            <option value="">Chọn tỉnh/thành phố</option>
                            {cities.map((city) => (
                                <option key={city.province_id} value={city.province_id}>{city.province_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="label-upgrade">Loại thợ muốn làm</label>
                        <select value={workerType} onChange={(e) => setWorkerType(e.target.value)} required>
                            <option value="">Chọn loại thợ</option>
                            <option value="workerType1">Thợ loại 1</option>
                            <option value="workerType2">Thợ loại 2</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label-upgrade">Tải ảnh căn cước công dân</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setIdCard(e.target.files[0])}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="label-upgrade">Tải ảnh giấy tờ chứng chỉ hành nghề</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCertification(e.target.files[0])}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="label-upgrade">Mô tả về bạn</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="5" // Increased the number of rows for a longer textarea
                        style={{ resize: 'vertical' }} // Allow vertical resizing
                    />
                </div>
                <button type="submit" className="submit-btn">Gửi yêu cầu</button>
            </form>
        </div>
    );
};

export default UpgradeRepairman;