import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from "../../../services/Address.js";
import { getServiceIndustryTypes, findRepairman, resetError, resetSuccess } from "../../../store/actions/userActions.js";
import Loading from "../../Loading/Loading.js";
import Swal from "sweetalert2";
import "./SearchBar.css";

// Debounce function (can be moved to a utils file)
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};


const SearchBar = ({ setSelectedRadius, selectedRadius, onSearch, onDataChange }) => {
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
    const [minPrice] = useState("200000"); // Adjusted example price
    const [maxPrice] = useState("500000"); // Adjusted example price

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


    // Debounced onDataChange callback from props
    const debouncedOnDataChange = useCallback(debounce(onDataChange, 500), [onDataChange]);

    // Lấy danh sách tỉnh/thành phố
    const fetchCities = async () => {
        try {
            const response = await apiGetPubliccitys();
            if (response?.data.results) {
                setCities(response.data.results);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    // Lấy danh sách quận/huyện
    const fetchDistricts = async (cityId) => { // Accept cityId
        if (!cityId) {
            setDistrict("");
            setDistrictName("");
            setDistricts([]);
            setWard(""); // Reset ward when district resets
            setWardName("");
            setWards([]);
            return;
        }
        try {
            const response = await apiGetPublicDistrict(cityId);
            if (response.status === 200 && response.data?.results) {
                setDistricts(response.data.results);
            } else {
                setDistricts([]); // Clear if error or no results
            }
        } catch (error) {
            console.error("Error fetching districts:", error);
            setDistricts([]);
        }
        setDistrict(""); // Reset selection when list changes
        setDistrictName("");
        setWard(""); // Reset ward when district resets
        setWardName("");
        setWards([]);
    };

    // Lấy danh sách phường/xã
    const fetchWards = async (districtId) => { // Accept districtId
        if (!districtId) {
            setWard("");
            setWardName("");
            setWards([]);
            return;
        }
        try {
            const response = await apiGetPublicWard(districtId);
            if (response.status === 200 && response.data?.results) {
                setWards(response.data.results);
            } else {
                setWards([]);
            }
        } catch (error) {
            console.error("Error fetching wards:", error);
            setWards([]);
        }
        setWard(""); // Reset selection when list changes
        setWardName("");
    };

    // Gọi API lấy danh sách loại dịch vụ
    useEffect(() => {
        dispatch(getServiceIndustryTypes());
    }, [dispatch]);

    // Cập nhật danh sách loại dịch vụ từ Redux store
    useEffect(() => {
        if (serviceTypesFromStore) {
            setServiceTypes(serviceTypesFromStore);
        }
    }, [serviceTypesFromStore]);

    // Lấy danh sách tỉnh/thành phố khi component mount
    useEffect(() => {
        fetchCities();
    }, []);

    // Fetch districts when city ID changes
    useEffect(() => {
        fetchDistricts(city);
    }, [city]);

    // Fetch wards when district ID changes
    useEffect(() => {
        fetchWards(district);
    }, [district]);


    // Cập nhật dữ liệu tìm kiếm gửi lên parent (including names)
    useEffect(() => {
        const searchData = {
            description,
            serviceIndustryId,
            detailAddress,
            ward, // Keep ID for potential API use
            district, // Keep ID for potential API use
            city, // Keep ID for potential API use
            wardName, // Add Name for geocoding
            districtName, // Add Name for geocoding
            cityName, // Add Name for geocoding
            selectedRadius,
            minPrice, // Include min/max price if needed by API via searchData
            maxPrice
        };
        // Use the debounced callback passed via props
        debouncedOnDataChange(searchData);
    }, [description, serviceIndustryId, detailAddress, ward, district, city, wardName, districtName, cityName, selectedRadius, minPrice, maxPrice, debouncedOnDataChange]); // Add dependencies


    // Xử lý thông báo thành công
    useEffect(() => {
        if (successFindRepairman) {
            // Swal.fire({
            //     icon: "success",
            //     title: "Đang tìm thợ", // Changed title
            //     text: successFindRepairman, // Message might need adjustment, e.g., "Đã gửi yêu cầu tìm thợ..."
            //     showConfirmButton: false,
            //     showCloseButton: true, // Allow closing
            //     // timer: 5000, // Remove timer? Let user see results section
            //     // timerProgressBar: true,
            // }).then(() => {
            //     dispatch(resetSuccess());
            //     onSearch(); // Propagate search trigger to parent (FindRepairman)
            // });

            dispatch(resetSuccess());
            onSearch(); // Propagate search trigger to parent (FindRepairman)
        }
    }, [successFindRepairman, dispatch, onSearch]);

    // Xử lý thông báo lỗi
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

    // Thêm hàm validateImageFiles
    const validateImageFiles = (files) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB limit per file
        let invalidFiles = [];
        let oversizedFiles = [];

        Array.from(files).forEach(file => {
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
                showConfirmButton: true, // Allow acknowledging
            });
            return false;
        }
        return true;
    };

    // Xử lý tìm kiếm và gọi API findRepairman
    const handleSearchClick = () => {
        // Construct address string using names
        const address = [detailAddress, wardName, districtName, cityName, "Việt Nam"]
            .filter(Boolean) // Remove empty parts
            .join(", ");

        // Basic validation before dispatching
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
            address, // Send the constructed address string
            radius: selectedRadius ? selectedRadius.value / 1000 : "", // Convert meters to km
            minPrice,
            maxPrice,
            // Include lat/lng if your API needs it and you get it from FindRepairman
            // latitude: mapCenter ? mapCenter[0] : null,
            // longitude: mapCenter ? mapCenter[1] : null,
        };

        //console.log('Dispatching findRepairman with data:', requestData);
        //console.log('Image files to send:', imageFiles);
        dispatch(findRepairman(requestData, imageFiles));
        // No need to call onSearch() here, it's done in the successFindRepairman effect
    };

    // Handlers for dropdown changes to update both ID and Name states
    const handleCityChange = (e) => {
        const selectedId = e.target.value;
        const selectedName = cities.find(c => c.province_id === selectedId)?.province_name || "";
        setCity(selectedId);
        setCityName(selectedName);
        // Reset lower levels
        setDistrict("");
        setDistrictName("");
        setWard("");
        setWardName("");
        setDistricts([]);
        setWards([]);
    };

    const handleDistrictChange = (e) => {
        const selectedId = e.target.value;
        const selectedName = districts.find(d => d.district_id === selectedId)?.district_name || "";
        setDistrict(selectedId);
        setDistrictName(selectedName);
        // Reset lower level
        setWard("");
        setWardName("");
        setWards([]);
    };

    const handleWardChange = (e) => {
        const selectedId = e.target.value;
        const selectedName = wards.find(w => w.ward_id === selectedId)?.ward_name || "";
        setWard(selectedId);
        setWardName(selectedName);
    };

    // if (!serviceTypes.length) {
    //     return <Loading />;
    // }

    // if (loading && !serviceTypes.length) { // Show loading only initially for service types
    //     return <Loading />;
    // }

    return (
        <div className="search-container">
            {/* Top Row */}
            <div className="search-row">
                <input
                    type="text"
                    placeholder="* Mô tả tình trạng cần sửa chữa" // Add asterisk for required
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
                {/* Moved Button to its own container for alignment */}
                <div className="search-button-container">
                    <button className="search-button" onClick={handleSearchClick} disabled={loading}> {/* Disable button when loading */}
                        {loading ? 'Đang xử lý...' : 'Tìm Kiếm'}
                    </button>
                </div>
            </div>
            {/* Bottom Row */}
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
            {/* File Input Row */}
            <div className="search-row file-input-row">
                <label htmlFor="imageUpload" className="file-input-label">Ảnh mô tả (tùy chọn, tối đa 5MB/ảnh):</label>
                <input
                    id="imageUpload"
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/gif" // Specify accepted types
                    onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (validateImageFiles(files)) {
                            setImageFiles(files);
                        } else {
                            e.target.value = null; // Reset input if file validation fails
                            setImageFiles([]); // Clear state too
                        }
                    }}
                    className="search-file-input"
                />
                {/* Display selected file names (optional) */}
                {imageFiles.length > 0 && (
                    <div className="selected-files">
                        {imageFiles.map(file => <span key={file.name}>{file.name}</span>)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;