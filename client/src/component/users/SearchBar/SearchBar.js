import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from "../../../services/Address.js";
import { getServiceIndustryTypes, findRepairman, resetError, resetSuccess } from "../../../store/actions/userActions.js";
import Loading from "../../Loading/Loading.js";
import Swal from "sweetalert2";
import "./SearchBar.css";

const SearchBar = ({ setSelectedRadius, selectedRadius, onSearch, onDataChange }) => {
    const dispatch = useDispatch();
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [description, setDescription] = useState("");
    const [serviceIndustryId, setServiceIndustryId] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [minPrice] = useState("2000000");
    const [maxPrice] = useState("3000000");

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

    // Debounce để giảm tần suất gọi onDataChange
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedOnDataChange = useCallback(debounce(onDataChange, 500), [onDataChange]);

    // Lấy danh sách tỉnh/thành phố
    const fetchCities = async () => {
        try {
            const response = await apiGetPubliccitys();
            setCities(response?.data.results);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    // Lấy danh sách quận/huyện
    const fetchDistricts = async () => {
        if (!city) {
            setDistrict("");
            setDistricts([]);
            return;
        }
        const response = await apiGetPublicDistrict(city);
        if (response.status === 200) {
            setDistricts(response.data?.results);
        }
    };

    // Lấy danh sách phường/xã
    const fetchWards = async () => {
        if (!district) {
            setWard("");
            setWards([]);
            return;
        }
        const response = await apiGetPublicWard(district);
        if (response.status === 200) {
            setWards(response.data?.results);
        }
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

    // Lấy danh sách quận/huyện khi tỉnh/thành phố thay đổi
    useEffect(() => {
        fetchDistricts();
    }, [city]);

    // Lấy danh sách phường/xã khi quận/huyện thay đổi
    useEffect(() => {
        fetchWards();
    }, [district]);

    // Cập nhật dữ liệu tìm kiếm gửi lên parent
    useEffect(() => {
        const searchData = {
            description,
            serviceIndustryId,
            detailAddress,
            ward,
            district,
            city,
            selectedRadius,
        };
        debouncedOnDataChange(searchData);
    }, [description, serviceIndustryId, detailAddress, ward, district, city, selectedRadius, debouncedOnDataChange]);

    // Xử lý thông báo thành công
    useEffect(() => {
        if (successFindRepairman) {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: successFindRepairman,
                showConfirmButton: false,
                showCloseButton: false,
                timer: 5000,
                timerProgressBar: true,
            }).then(() => {
                dispatch(resetSuccess());
                onSearch();
            });
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

    // Xử lý tìm kiếm và gọi API findRepairman
    const handleSearchClick = () => {
        const selectedWard = wards.find((w) => w.ward_id === ward)?.ward_name || "";
        const selectedDistrict = districts.find((d) => d.district_id === district)?.district_name || "";
        const selectedCity = cities.find((c) => c.province_id === city)?.province_name || "";

        const address = [detailAddress, selectedWard, selectedDistrict, selectedCity, "Việt Nam"]
            .filter(Boolean)
            .join(", ");

        const requestData = {
            description,
            serviceIndustry_id: serviceIndustryId,
            address,
            radius: selectedRadius ? selectedRadius.value / 1000 : "",
            minPrice,
            maxPrice,
        };

        console.log('Image files to send:', imageFiles);
        dispatch(findRepairman(requestData, imageFiles));
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="search-container">
            <div className="search-top">
                <input
                    type="text"
                    placeholder="Mô tả tình trạng cần sửa chữa"
                    className="search-input-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select
                    value={serviceIndustryId}
                    onChange={(e) => setServiceIndustryId(e.target.value)}
                    className="search-dropdown"
                >
                    <option value="">Chọn loại thợ</option>
                    {serviceTypes.length > 0 ? (
                        serviceTypes.map((type) => (
                            <option key={type._id} value={type._id}>
                                {type.type}
                            </option>
                        ))
                    ) : (
                        <option value="">Không có loại thợ nào</option>
                    )}
                </select>
                <select
                    value={selectedRadius ? selectedRadius.value : ""}
                    onChange={(e) => {
                        const selectedOption = radiusOptions.find((option) => option.value === e.target.value);
                        setSelectedRadius(selectedOption || null);
                    }}
                    className="search-dropdown"
                >
                    <option value="">Chọn bán kính</option>
                    {radiusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <button className="search-button" onClick={handleSearchClick}>
                    Tìm Kiếm
                </button>
            </div>
            <div className="search-bottom">
                <input
                    type="text"
                    placeholder="Số nhà và tên đường"
                    className="search-input"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                />
                <select className="search-dropdown" onChange={(e) => setWard(e.target.value)} value={ward}>
                    <option value="">Chọn phường/xã</option>
                    {wards.map((w) => (
                        <option key={w.ward_id} value={w.ward_id}>
                            {w.ward_name}
                        </option>
                    ))}
                </select>
                <select className="search-dropdown" onChange={(e) => setDistrict(e.target.value)} value={district}>
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((d) => (
                        <option key={d.district_id} value={d.district_id}>
                            {d.district_name}
                        </option>
                    ))}
                </select>
                <select className="search-dropdown" onChange={(e) => setCity(e.target.value)} value={city}>
                    <option value="">Chọn tỉnh/thành phố</option>
                    {cities.map((c) => (
                        <option key={c.province_id} value={c.province_id}>
                            {c.province_name}
                        </option>
                    ))}
                </select>
            </div>
            <input
                type="file"
                multiple
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                className="search-file-input"
            />
        </div>
    );
};

export default SearchBar;