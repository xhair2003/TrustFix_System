import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo, requestRepairmanUpgrade, getServiceIndustryTypes, resetError, resetSuccess } from "../../../store/actions/userActions.js";
import "./UpgradeRepairman.css";
import Loading from "../../../component/Loading/Loading.js";
import Swal from "sweetalert2";
import vietnamProvinces from "../../../services/VietNamProvinces.json"; // Import the JSON file

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
    const [serviceTypes, setServiceTypes] = useState([]);

    const dispatch = useDispatch();
    const { userInfo, loading, successUpgrade, errorUpgrade, serviceTypes: serviceTypesFromStore } = useSelector((state) => state.user);

    //console.log('user-info', userInfo);

    // Nếu userInfo chưa có, hiển thị thông báo hoặc giá trị mặc định
    useEffect(() => {
        if (!userInfo) {
            dispatch(getUserInfo()); // Gọi action để lấy thông tin người dùng nếu chưa có
        }
    }, [dispatch, userInfo]); // Thêm userInfo vào dependency để re-fetch nếu cần

    // Load cities from JSON
    useEffect(() => {
        const formattedCities = vietnamProvinces.map((province) => ({
            province_id: province.code,
            province_name: province.name,
        }));
        setCities(formattedCities);
    }, []);

    // Load districts when city changes
    useEffect(() => {
        if (!city) {
            setDistrict("");
            setDistricts([]);
            setWard("");
            setWards([]);
            return;
        }
        const selectedProvince = vietnamProvinces.find((p) => p.code === parseInt(city));
        if (selectedProvince && selectedProvince.districts) {
            const formattedDistricts = selectedProvince.districts.map((district) => ({
                district_id: district.code,
                district_name: district.name,
            }));
            setDistricts(formattedDistricts);
        } else {
            setDistricts([]);
        }
        setDistrict("");
        setWard("");
        setWards([]);
    }, [city]);

    // Load wards when district changes
    useEffect(() => {
        if (!district) {
            setWard("");
            setWards([]);
            return;
        }
        const selectedProvince = vietnamProvinces.find((p) => p.code === parseInt(city));
        if (selectedProvince) {
            const selectedDistrict = selectedProvince.districts.find((d) => d.code === parseInt(district));
            if (selectedDistrict && selectedDistrict.wards) {
                const formattedWards = selectedDistrict.wards.map((ward) => ({
                    ward_id: ward.code,
                    ward_name: ward.name,
                }));
                setWards(formattedWards);
            } else {
                setWards([]);
            }
        } else {
            setWards([]);
        }
        setWard("");
    }, [district]);

    // Fetch service types
    useEffect(() => {
        dispatch(getServiceIndustryTypes());
    }, [dispatch]);

    useEffect(() => {
        if (serviceTypesFromStore) {
            setServiceTypes(serviceTypesFromStore);
        }
    }, [serviceTypesFromStore]);

    // Handle success and error notifications
    useEffect(() => {
        if (successUpgrade) {
            Swal.fire({
                title: "Thành công",
                text: successUpgrade,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
                timerProgressBar: true,
                showCloseButton: false,
            });
            dispatch(resetSuccess());
        } else if (errorUpgrade) {
            Swal.fire({
                title: "Lỗi",
                text: errorUpgrade,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
                timerProgressBar: true,
                showCloseButton: false,
            });
            dispatch(resetError());
        }
    }, [successUpgrade, errorUpgrade, dispatch]);

    const handleFileUpload = (e, setFile) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                Swal.fire({
                    title: "Lỗi",
                    text: "Vui lòng chỉ upload ảnh định dạng JPG, PNG hoặc JPEG!",
                    icon: "error",
                });
                return;
            }
            setFile(file);
        }
    };

    const handleIdCardUpload = (e) => {
        handleFileUpload(e, setIdCard);
    };

    const handleCertificationUpload = (e) => {
        handleFileUpload(e, setCertification);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(resetError());
        dispatch(resetSuccess());

        const fullAddress = [
            address,
            wards.find((w) => w.ward_id === parseInt(ward))?.ward_name || "",
            districts.find((d) => d.district_id === parseInt(district))?.district_name || "",
            cities.find((c) => c.province_id === parseInt(city))?.province_name || "",
        ]
            .filter(Boolean)
            .join(", ");

        const formData = new FormData();
        formData.append("address", fullAddress);
        formData.append("serviceType", workerType);
        formData.append("description", description);

        if (idCard) {
            formData.append("imgCCCD", idCard);
        }
        if (certification) {
            formData.append("imgCertificatePractice", certification);
        }

        dispatch(requestRepairmanUpgrade(formData));
    };

    // Hiển thị thông báo nếu userInfo không có hoặc loading nếu đang tải userInfo
    if (!userInfo || loading) {
        return <Loading />;
    }

    return (
        <div className="upgrade-repairman-form">
            <h1 className="form-title">Gửi yêu cầu nâng cấp lên thợ</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h2 className="section-title">Thông tin cá nhân</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Họ và Tên</label>
                            <input
                                type="text"
                                value={`${userInfo.firstName} ${userInfo.lastName}`}
                                readOnly
                                className="form-input readonly"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                value={userInfo.email}
                                readOnly
                                className="form-input readonly"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Số điện thoại</label>
                            <input
                                type="tel"
                                value={userInfo.phone}
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
                                {serviceTypes.length > 0 ? (
                                    serviceTypes.map((type) => (
                                        <option key={type._id} value={type.type}>
                                            {type.type}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Không có loại thợ nào</option>
                                )}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tải ảnh căn cước công dân</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={handleIdCardUpload}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tải ảnh giấy tờ chứng chỉ hành nghề</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={handleCertificationUpload}
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
                                    width: '98%',
                                    minHeight: '40px',
                                    padding: '0.5rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu"}
                </button>
            </form>
        </div>
    );
};

export default UpgradeRepairman;