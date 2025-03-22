// import './SearchBar.css';
// import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from '../../../services/Address.js';
// import React, { useEffect, useState } from 'react';
// import { getServiceIndustryTypes } from "../../../store/actions/userActions.js";
// import { useDispatch, useSelector } from "react-redux";
// import Loading from "../../Loading/Loading.js";

// const SearchBar = () => {
//     const [cities, setCities] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [wards, setWards] = useState([]);
//     const dispatch = useDispatch();
//     const [city, setCity] = useState('');
//     const [district, setDistrict] = useState('');
//     const [ward, setWard] = useState('');
//     const [detailAddress, setDetailAddress] = useState('');
//     const { loading, serviceTypes: serviceTypesFromStore } = useSelector(state => state.user);
//     // Thêm biến state cho serviceTypes
//     const [serviceTypes, setServiceTypes] = useState([]);

//     // Gọi API để lấy danh sách loại thợ khi component mount
//     useEffect(() => {
//         dispatch(getServiceIndustryTypes()); // Dispatch action để lấy dữ liệu serviceTypes
//     }, [dispatch]);

//     useEffect(() => {
//         const fetchCities = async () => {
//             try {
//                 const response = await apiGetPubliccitys();
//                 setCities(response?.data.results);
//             } catch (error) {
//                 console.error('Error fetching cities:', error);
//             }
//         };

//         fetchCities();
//     }, []);

//     useEffect(() => {
//         const fetchDistricts = async () => {
//             if (!city) {
//                 setDistrict('');
//                 setDistricts([]);
//                 return;
//             }
//             const response = await apiGetPublicDistrict(city);
//             if (response.status === 200) {
//                 setDistricts(response.data?.results);
//             }
//         };
//         fetchDistricts();
//     }, [city]);

//     useEffect(() => {
//         const fetchWards = async () => {
//             if (!district) {
//                 setWard('');
//                 setWards([]);
//                 return;
//             }
//             const response = await apiGetPublicWard(district);
//             if (response.status === 200) {
//                 setWards(response.data?.results);
//             }
//         };
//         fetchWards();
//     }, [district]);

//     // Cập nhật lại serviceTypes từ Redux nếu có
//     useEffect(() => {
//         if (serviceTypesFromStore) {
//             setServiceTypes(serviceTypesFromStore);
//         }
//     }, [serviceTypesFromStore]);

//     console.log(serviceTypes);

//     if (loading) {
//         return <Loading />;
//     }

//     return (
//         <div className="search-container">
//             <div className="search-top">
//                 <input type="text" placeholder="Mô tả tình trạng cần sửa chữa" className="search-input-description" />

//                 <select
//                     value={serviceTypes}
//                     onChange={(e) => setServiceTypes(e.target.value)}
//                     required
//                     className="search-dropdown"
//                 >
//                     <option value="">Chọn loại thợ</option>
//                     {serviceTypes.length > 0 ? (
//                         serviceTypes.map((type) => (
//                             <option key={type._id} value={type._id}>
//                                 {type.type}
//                             </option>
//                         ))
//                     ) : (
//                         <option value="">Không có loại thợ nào</option>
//                     )}
//                 </select>

//                 <select className="search-dropdown">
//                     <option value="">Chọn bán kính</option>
//                     <option value="5">5 km</option>
//                     <option value="10">10 km</option>
//                     <option value="20">20 km</option>
//                 </select>

//                 <button className="search-button">Tìm Kiếm</button>
//             </div>
//             <div className="search-bottom">
//                 <input type="text" placeholder="Số nhà và tên đường" className="search-input" />

//                 <select className="search-dropdown" onChange={(e) => setWard(e.target.value)} value={ward}>
//                     <option value="">Chọn phường/xã</option>
//                     {wards.map((ward) => (
//                         <option key={ward.ward_id} value={ward.ward_id}>{ward.ward_name}</option>
//                     ))}
//                 </select>

//                 <select className="search-dropdown" onChange={(e) => setDistrict(e.target.value)} value={district}>
//                     <option value="">Chọn quận/huyện</option>
//                     {districts.map((district) => (
//                         <option key={district.district_id} value={district.district_id}>{district.district_name}</option>
//                     ))}
//                 </select>

//                 <select className="search-dropdown" onChange={(e) => setCity(e.target.value)} value={city}>
//                     <option value="">Chọn tỉnh/thành phố</option>
//                     {cities.map((city) => (
//                         <option key={city.province_id} value={city.province_id}>{city.province_name}</option>
//                     ))}
//                 </select>
//             </div>
//         </div>
//     );
// }

// export default SearchBar;


import './SearchBar.css';
import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from '../../../services/Address.js';
import React, { useEffect, useState } from 'react';
import { getServiceIndustryTypes } from "../../../store/actions/userActions.js";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../Loading/Loading.js";

const SearchBar = ({ setSelectedRadius, selectedRadius, onSearch }) => {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const dispatch = useDispatch();

    // State cho các trường dữ liệu
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [detailAddress, setDetailAddress] = useState(''); // Số nhà và tên đường
    const [description, setDescription] = useState('');
    const [serviceIndustryId, setServiceIndustryId] = useState('');
    const [imageFiles, setImageFiles] = useState([]); // Mảng file ảnh

    const { loading, serviceTypes: serviceTypesFromStore } = useSelector(state => state.user);
    const [serviceTypes, setServiceTypes] = useState([]);

    // Giá giả định mặc định
    const [minPrice] = useState("2000000"); // Ví dụ: 2 triệu VND
    const [maxPrice] = useState("3000000"); // Ví dụ: 3 triệu VND

    // Danh sách tùy chọn bán kính (object giống FindSearchBar)
    const radiusOptions = [
        { value: "500", label: "500 m" },
        { value: "1000", label: "1 km" },
        { value: "2000", label: "2 km" },
        { value: "5000", label: "5 km" },
    ];

    // Gọi API để lấy danh sách loại thợ khi component mount
    useEffect(() => {
        dispatch(getServiceIndustryTypes());
    }, [dispatch]);

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
            const response = await apiGetPublicDistrict(city);
            if (response.status === 200) {
                setDistricts(response.data?.results);
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
            const response = await apiGetPublicWard(district);
            if (response.status === 200) {
                setWards(response.data?.results);
            }
        };
        fetchWards();
    }, [district]);

    // Cập nhật serviceTypes từ Redux
    useEffect(() => {
        if (serviceTypesFromStore) {
            setServiceTypes(serviceTypesFromStore);
        }
    }, [serviceTypesFromStore]);

    // Hàm xử lý khi nhấn nút "Tìm kiếm"
    const handleSearchClick = () => {
        // Tìm tên phường, quận, tỉnh từ ID đã chọn
        const selectedWard = wards.find(w => w.ward_id === ward)?.ward_name || '';
        const selectedDistrict = districts.find(d => d.district_id === district)?.district_name || '';
        const selectedCity = cities.find(c => c.province_id === city)?.province_name || '';

        // Gộp address
        const address = [detailAddress, selectedWard, selectedDistrict, selectedCity, "Việt Nam"]
            .filter(Boolean) // Loại bỏ các giá trị rỗng
            .join(", ");

        // Tạo requestData
        const requestData = {
            description,
            serviceIndustry_id: serviceIndustryId,
            address,
            radius: selectedRadius ? selectedRadius.value : '', // Lấy value từ object selectedRadius
            minPrice,
            maxPrice,
        };

        // Log dữ liệu để kiểm tra
        console.log("requestData:", requestData);
        console.log("imageFiles:", imageFiles);

        // Gọi hàm onSearch từ props để trigger logic trong FindRepairman
        onSearch();
    };

    // if (loading) {
    //     return <Loading />;
    // }

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
                    required
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
                    value={selectedRadius ? selectedRadius.value : ''} // Đồng bộ với object
                    onChange={(e) => {
                        const selectedOption = radiusOptions.find(option => option.value === e.target.value);
                        setSelectedRadius(selectedOption || null); // Cập nhật object hoặc null
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

                <select
                    className="search-dropdown"
                    onChange={(e) => setWard(e.target.value)}
                    value={ward}
                >
                    <option value="">Chọn phường/xã</option>
                    {wards.map((w) => (
                        <option key={w.ward_id} value={w.ward_id}>
                            {w.ward_name}
                        </option>
                    ))}
                </select>

                <select
                    className="search-dropdown"
                    onChange={(e) => setDistrict(e.target.value)}
                    value={district}
                >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((d) => (
                        <option key={d.district_id} value={d.district_id}>
                            {d.district_name}
                        </option>
                    ))}
                </select>

                <select
                    className="search-dropdown"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                >
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