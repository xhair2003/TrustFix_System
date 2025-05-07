import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServiceIndustryTypes, findRepairman, resetError, resetSuccess } from "../../../store/actions/userActions.js";
import Loading from "../../Loading/Loading.js";
import Swal from "sweetalert2";
import "./SearchBar.css";
import vietnamProvinces from "../../../services/VietNamProvinces.json"; // Import the JSON file

// Debounce function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const SearchBar = ({ setSelectedRadius, selectedRadius, onSearch, onDataChange, minPrice, maxPrice }) => {
    const dispatch = useDispatch();
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [city, setCity] = useState(""); // ID
    const [district, setDistrict] = useState(""); // ID
    const [ward, setWard] = useState(""); // ID
    const [cityName, setCityName] = useState(""); // Name
    const [districtName, setDistrictName] = useState(""); // Name
    const [wardName, setWardName] = useState(""); // Name

    const [detailAddress, setDetailAddress] = useState("");
    const [description, setDescription] = useState("");
    const [serviceIndustryId, setServiceIndustryId] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);

    const { loading, serviceTypes: serviceTypesFromStore } = useSelector((state) => state.user);
    const { successFindRepairman, errorFindRepairman } = useSelector((state) => state.user);

    const radiusOptions = [
        { value: "500", label: "500 m" },
        { value: "1000", label: "1 km" },
        { value: "2000", label: "2 km" },
        { value: "5000", label: "5 km" },
        { value: "10000", label: "10 km" },
        { value: "15000", label: "15 km" },
    ];

    // Debounced onDataChange callback
    const debouncedOnDataChange = useCallback(debounce(onDataChange, 500), [onDataChange]);

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
            setDistrictName("");
            setDistricts([]);
            setWard("");
            setWardName("");
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
        setDistrictName("");
        setWard("");
        setWardName("");
        setWards([]);
    }, [city]);

    // Load wards when district changes
    useEffect(() => {
        if (!district) {
            setWard("");
            setWardName("");
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
        setWardName("");
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

    // Update search data
    useEffect(() => {
        const searchData = {
            description,
            serviceIndustryId,
            detailAddress,
            ward,
            district,
            city,
            wardName,
            districtName,
            cityName,
            selectedRadius,
            minPrice: minPrice?.toString(),
            maxPrice: maxPrice?.toString(),
        };
        debouncedOnDataChange(searchData);
    }, [description, serviceIndustryId, detailAddress, ward, district, city, wardName, districtName, cityName, selectedRadius, minPrice, maxPrice, debouncedOnDataChange]);

    // Handle success and error notifications
    useEffect(() => {
        if (successFindRepairman) {
            dispatch(resetSuccess());
            onSearch();
        }
    }, [successFindRepairman, dispatch, onSearch]);

    useEffect(() => {
        if (errorFindRepairman) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: errorFindRepairman,
                showConfirmButton: false,
                showCloseButton: false,
                timer: 5000,
                timerProgressBar: true,
            }).then(() => {
                dispatch(resetError());
            });
        }
    }, [errorFindRepairman, dispatch]);

    // Validate image files
    const validateImageFiles = (files) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        let invalidFiles = [];
        let oversizedFiles = [];

        Array.from(files).forEach((file) => {
            if (!validTypes.includes(file.type)) {
                invalidFiles.push(file.name);
            }
            if (file.size > maxSize) {
                oversizedFiles.push(file.name);
            }
        });

        let errorText = "";
        if (invalidFiles.length > 0) {
            errorText += `File không hợp lệ: ${invalidFiles.join(', ')}. Chỉ hỗ trợ JPG, PNG, JPEG, GIF.\n`;
        }
        if (oversizedFiles.length > 0) {
            errorText += `File vượt quá 5MB: ${oversizedFiles.join(', ')}.`;
        }

        if (errorText) {
            Swal.fire({
                icon: "error",
                title: "Lỗi Tải Lên",
                text: errorText,
                showConfirmButton: true,
            });
            return false;
        }
        return true;
    };

    // Handle search
    const handleSearchClick = () => {
        const address = [detailAddress, wardName, districtName, cityName, "Việt Nam"]
            .filter(Boolean)
            .join(", ");

        if (!description || !serviceIndustryId || !detailAddress || !wardName || !districtName || !cityName || !selectedRadius) {
            Swal.fire({
                icon: "warning",
                title: "Thiếu thông tin",
                text: "Vui lòng điền đầy đủ các trường bắt buộc (mô tả, loại thợ, địa chỉ, bán kính).",
            });
            return;
        }

        const requestData = {
            description,
            serviceIndustry_id: serviceIndustryId,
            address,
            radius: selectedRadius ? selectedRadius.value / 1000 : "",
            minPrice: minPrice?.toString(),
            maxPrice: maxPrice?.toString(),
        };

        dispatch(findRepairman(requestData, imageFiles));
    };

    // Handle dropdown changes
    const handleCityChange = (e) => {
        const selectedId = e.target.value;
        const selectedName = cities.find((c) => c.province_id === parseInt(selectedId))?.province_name || "";
        setCity(selectedId);
        setCityName(selectedName);
        setDistrict("");
        setDistrictName("");
        setWard("");
        setWardName("");
        setDistricts([]);
        setWards([]);
    };

    const handleDistrictChange = (e) => {
        const selectedId = e.target.value;
        const selectedName = districts.find((d) => d.district_id === parseInt(selectedId))?.district_name || "";
        setDistrict(selectedId);
        setDistrictName(selectedName);
        setWard("");
        setWardName("");
        setWards([]);
    };

    const handleWardChange = (e) => {
        const selectedId = e.target.value;
        const selectedName = wards.find((w) => w.ward_id === parseInt(selectedId))?.ward_name || "";
        setWard(selectedId);
        setWardName(selectedName);
    };

    if (loading) return <Loading />;

    return (
        <div className="search-container">
            <div className="search-row">
                <input
                    type="text"
                    placeholder="* Mô tả tình trạng cần sửa chữa"
                    className="search-input-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <select
                    value={serviceIndustryId}
                    onChange={(e) => setServiceIndustryId(e.target.value)}
                    className="search-dropdown"
                    required
                >
                    <option value="">* Chọn loại thợ</option>
                    {serviceTypes.length > 0 ? (
                        serviceTypes.map((type) => (
                            <option key={type._id} value={type._id}>
                                {type.type}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>Đang tải...</option>
                    )}
                </select>
                <select
                    value={selectedRadius ? selectedRadius.value : ""}
                    onChange={(e) => {
                        const selectedOption = radiusOptions.find((option) => option.value === e.target.value);
                        setSelectedRadius(selectedOption || null);
                    }}
                    className="search-dropdown"
                    required
                >
                    <option value="">* Chọn bán kính</option>
                    {radiusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="search-button-container">
                    <button className="search-button" onClick={handleSearchClick} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Tìm Kiếm"}
                    </button>
                </div>
            </div>
            <div className="search-row">
                <input
                    type="text"
                    placeholder="* Số nhà và tên đường"
                    className="search-input"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    required
                />
                <select className="search-dropdown" onChange={handleWardChange} value={ward} required>
                    <option value="">* Chọn phường/xã</option>
                    {districts.length === 0 && <option value="" disabled>Chọn quận/huyện trước</option>}
                    {wards.map((w) => (
                        <option key={w.ward_id} value={w.ward_id}>
                            {w.ward_name}
                        </option>
                    ))}
                </select>
                <select className="search-dropdown" onChange={handleDistrictChange} value={district} required>
                    <option value="">* Chọn quận/huyện</option>
                    {cities.length === 0 && <option value="" disabled>Chọn tỉnh/thành trước</option>}
                    {districts.map((d) => (
                        <option key={d.district_id} value={d.district_id}>
                            {d.district_name}
                        </option>
                    ))}
                </select>
                <select className="search-dropdown" onChange={handleCityChange} value={city} required>
                    <option value="">* Chọn tỉnh/thành phố</option>
                    {cities.map((c) => (
                        <option key={c.province_id} value={c.province_id}>
                            {c.province_name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="search-row file-input-row">
                <label htmlFor="imageUpload" className="file-input-label">Ảnh mô tả (tùy chọn, tối đa 5MB/ảnh):</label>
                <input
                    id="imageUpload"
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (validateImageFiles(files)) {
                            setImageFiles(files);
                        } else {
                            e.target.value = null;
                            setImageFiles([]);
                        }
                    }}
 className="search-file-input"
                />
                {imageFiles.length > 0 && (
                    <div className="selected-files">
                        {imageFiles.map((file) => (
                            <span key={file.name}>{file.name}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;