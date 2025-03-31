import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestRepairmanUpgrade, getServiceIndustryTypes, resetError, resetSuccess } from "../../../store/actions/userActions.js";
import "./UpgradeRepairman.css";
import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from "../../../services/Address.js";
import Loading from "../../../component/Loading/Loading.js";
import Swal from "sweetalert2";

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

    // Thêm biến state cho serviceTypes
    const [serviceTypes, setServiceTypes] = useState([]);

    const dispatch = useDispatch();
    const { loading, successUpgrade, errorUpgrade, serviceTypes: serviceTypesFromStore } = useSelector(state => state.user);

    //console.log("successUpgrade", successUpgrade);
    //console.log("errorUpgrade", errorUpgrade);

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

    // Gọi API để lấy danh sách loại thợ khi component mount
    useEffect(() => {
        dispatch(getServiceIndustryTypes()); // Dispatch action để lấy dữ liệu serviceTypes
    }, [dispatch]);

    // Cập nhật lại serviceTypes từ Redux nếu có
    useEffect(() => {
        if (serviceTypesFromStore) {
            setServiceTypes(serviceTypesFromStore);
        }
    }, [serviceTypesFromStore]);

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
            dispatch(resetSuccess()); // Reset success message after showing it
        }

        else if (errorUpgrade) {
            Swal.fire({
                title: "Lỗi",
                text: errorUpgrade,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
                timerProgressBar: true,
                showCloseButton: false,
            });
            dispatch(resetError()); // Reset error message after showing it
        }
    }, [successUpgrade, errorUpgrade, dispatch]);

    //console.log(serviceTypes);

    if (loading) {
        return <Loading />;
    }

    const handleFileUpload = (e, setFile) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra định dạng file
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert('Vui lòng chỉ upload ảnh định dạng JPG, PNG hoặc JPEG!');
                return; // Ngừng thực hiện nếu định dạng không hợp lệ
            }

            setFile(file); // Lưu file vào state
        }
    };

    // Thêm hàm kiểm tra cho các trường ảnh
    const handleIdCardUpload = (e) => {
        handleFileUpload(e, setIdCard);  // Gọi hàm kiểm tra cho ảnh căn cước công dân
    };

    const handleCertificationUpload = (e) => {
        handleFileUpload(e, setCertification);  // Gọi hàm kiểm tra cho ảnh chứng chỉ hành nghề
    };



    const handleSubmit = (e) => {
        e.preventDefault();

        // reset message trước khi call API
        dispatch(resetError());
        dispatch(resetSuccess());

        const formData = new FormData();

        // Gộp các phần của địa chỉ lại, sử dụng tên thay vì ID
        const fullAddress = `${address}, ${wards.find(w => w.ward_id === ward)?.ward_name || ''}, ${districts.find(d => d.district_id === district)?.district_name || ''}, ${cities.find(c => c.province_id === city)?.province_name || ''}`;


        formData.append("address", fullAddress); // Địa chỉ
        formData.append("serviceType", workerType); // Loại thợ
        formData.append("description", description); // Mô tả

        // nếu đẩy 1 ảnh thì dùng cái này
        // Đảm bảo rằng đang đính kèm các tệp đúng
        // if (idCard) {
        //     formData.append("imgCCCD", idCard); // Đảm bảo gửi tệp đúng trường
        // }

        // if (certification) {
        //     formData.append("imgCertificatePractice", certification); // Đảm bảo gửi tệp đúng trường
        // }

        // Nếu đẩy nhiều ảnh thì cần lặp qua mảng
        if (idCard && idCard.length) {
            idCard.forEach(file => {
                formData.append("imgCCCD", file); // Đảm bảo gửi từng file trong mảng
            });
        } else if (idCard) {
            formData.append("imgCCCD", idCard); // Đảm bảo gửi tệp đúng trường
        }

        if (certification && certification.length) {
            certification.forEach(file => {
                formData.append("imgCertificatePractice", file); // Đảm bảo gửi từng file trong mảng
            });
        } else if (certification) {
            formData.append("imgCertificatePractice", certification); // Đảm bảo gửi tệp đúng trường
        }



        console.log(formData);

        dispatch(requestRepairmanUpgrade(formData)); // Dispatch action để gửi yêu cầu lên API
    };

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
                                accept="image/*"
                                onChange={handleIdCardUpload}  // Thay đổi hàm onChange
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tải ảnh giấy tờ chứng chỉ hành nghề</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCertificationUpload}  // Thay đổi hàm onChange
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
                                    width: '98%', // Đảm bảo độ rộng đầy đủ
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

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu"}
                </button>
            </form>
        </div>
    );
};

export default UpgradeRepairman;
