// import './SearchBar.css';
// import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from '../../../services/Address.js';
// import React, { useEffect, useState } from 'react';
// import { getServiceIndustryTypes, findRepairman, resetError, resetSuccess } from "../../../store/actions/userActions.js";
// import { useDispatch, useSelector } from "react-redux";
// import Loading from "../../Loading/Loading.js";
// import Swal from 'sweetalert2'; // Import SweetAlert2

// const SearchBar = ({
//     setSelectedRadius,
//     selectedRadius,
//     onSearch,
//     onDataChange
// }) => {
//     const [cities, setCities] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [wards, setWards] = useState([]);
//     const dispatch = useDispatch();

//     const [city, setCity] = useState('');
//     const [district, setDistrict] = useState('');
//     const [ward, setWard] = useState('');
//     const [detailAddress, setDetailAddress] = useState('');
//     const [description, setDescription] = useState('');
//     const [serviceIndustryId, setServiceIndustryId] = useState('');
//     const [imageFiles, setImageFiles] = useState([]);

//     const { loading, serviceTypes: serviceTypesFromStore } = useSelector(state => state.user);
//     const { successFindRepairman, errorFindRepairman } = useSelector(state => state.user);
//     const [serviceTypes, setServiceTypes] = useState([]);

//     const [minPrice] = useState("2000000"); // Dữ liệu giả
//     const [maxPrice] = useState("3000000"); // Dữ liệu giả

//     const radiusOptions = [
//         { value: "500", label: "500 m" },
//         { value: "1000", label: "1 km" },
//         { value: "2000", label: "2 km" },
//         { value: "5000", label: "5 km" },
//         { value: "10000", label: "10 km" },
//         { value: "15000", label: "15 km" },
//     ];

//     useEffect(() => {
//         dispatch(getServiceIndustryTypes());
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

//     useEffect(() => {
//         if (serviceTypesFromStore) {
//             setServiceTypes(serviceTypesFromStore);
//         }
//     }, [serviceTypesFromStore]);

//     // Truyền dữ liệu lên FindRepairman mỗi khi có thay đổi
//     useEffect(() => {
//         const searchData = {
//             description,
//             serviceIndustryId,
//             detailAddress,
//             ward,
//             district,
//             city,
//             selectedRadius,
//         };
//         onDataChange(searchData);
//     }, [description, serviceIndustryId, detailAddress, ward, district, city, selectedRadius, onDataChange]);

//     // Theo dõi successFindRepairman và errorFindRepairman để hiển thị thông báo
//     useEffect(() => {
//         if (successFindRepairman) {
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Thành công',
//                 text: successFindRepairman,
//                 showConfirmButton: false, // Không hiển thị nút OK
//                 showCloseButton: false, // Không hiển thị nút đóng
//                 timer: 5000, // Tự động đóng sau 5 giây
//                 timerProgressBar: true, // Hiển thị thanh timeline
//             }).then(() => {
//                 dispatch(resetSuccess()); // Reset trạng thái success sau khi thông báo đóng
//                 onSearch(); // Trigger animation sau khi thông báo thành công
//             });
//         }
//     }, [successFindRepairman, dispatch, onSearch]);

//     useEffect(() => {
//         if (errorFindRepairman) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Lỗi',
//                 text: errorFindRepairman,
//                 showConfirmButton: false, // Không hiển thị nút OK
//                 showCloseButton: false, // Không hiển thị nút đóng
//                 timer: 5000, // Tự động đóng sau 5 giây
//                 timerProgressBar: true, // Hiển thị thanh timeline
//             }).then(() => {
//                 dispatch(resetError()); // Reset trạng thái error sau khi thông báo đóng
//             });
//         }
//     }, [errorFindRepairman, dispatch]);

//     const handleSearchClick = () => {
//         const selectedWard = wards.find(w => w.ward_id === ward)?.ward_name || '';
//         const selectedDistrict = districts.find(d => d.district_id === district)?.district_name || '';
//         const selectedCity = cities.find(c => c.province_id === city)?.province_name || '';

//         const address = [detailAddress, selectedWard, selectedDistrict, selectedCity, "Việt Nam"]
//             .filter(Boolean)
//             .join(", ");

//         const requestData = {
//             description,
//             serviceIndustry_id: serviceIndustryId,
//             address,
//             radius: selectedRadius ? selectedRadius.value : '',
//             minPrice,
//             maxPrice,
//         };

//         // Gọi API findRepairman
//         dispatch(findRepairman(requestData, imageFiles));

//         console.log("requestData:", requestData);
//         console.log("imageFiles:", imageFiles);
//     };

//     if (loading) {
//         return <Loading />;
//     }

//     return (
//         <div className="search-container">
//             <div className="search-top">
//                 <input
//                     type="text"
//                     placeholder="Mô tả tình trạng cần sửa chữa"
//                     className="search-input-description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                 />
//                 <select
//                     value={serviceIndustryId}
//                     onChange={(e) => setServiceIndustryId(e.target.value)}
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
//                 <select
//                     value={selectedRadius ? selectedRadius.value : ''}
//                     onChange={(e) => {
//                         const selectedOption = radiusOptions.find(option => option.value === e.target.value);
//                         setSelectedRadius(selectedOption || null);
//                     }}
//                     className="search-dropdown"
//                 >
//                     <option value="">Chọn bán kính</option>
//                     {radiusOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                             {option.label}
//                         </option>
//                     ))}
//                 </select>
//                 <button className="search-button" onClick={handleSearchClick}>
//                     Tìm Kiếm
//                 </button>
//             </div>
//             <div className="search-bottom">
//                 <input
//                     type="text"
//                     placeholder="Số nhà và tên đường"
//                     className="search-input"
//                     value={detailAddress}
//                     onChange={(e) => setDetailAddress(e.target.value)}
//                 />
//                 <select
//                     className="search-dropdown"
//                     onChange={(e) => setWard(e.target.value)}
//                     value={ward}
//                 >
//                     <option value="">Chọn phường/xã</option>
//                     {wards.map((w) => (
//                         <option key={w.ward_id} value={w.ward_id}>
//                             {w.ward_name}
//                         </option>
//                     ))}
//                 </select>
//                 <select
//                     className="search-dropdown"
//                     onChange={(e) => setDistrict(e.target.value)}
//                     value={district}
//                 >
//                     <option value="">Chọn quận/huyện</option>
//                     {districts.map((d) => (
//                         <option key={d.district_id} value={d.district_id}>
//                             {d.district_name}
//                         </option>
//                     ))}
//                 </select>
//                 <select
//                     className="search-dropdown"
//                     onChange={(e) => setCity(e.target.value)}
//                     value={city}
//                 >
//                     <option value="">Chọn tỉnh/thành phố</option>
//                     {cities.map((c) => (
//                         <option key={c.province_id} value={c.province_id}>
//                             {c.province_name}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             <input
//                 type="file"
//                 multiple
//                 onChange={(e) => setImageFiles(Array.from(e.target.files))}
//                 className="search-file-input"
//             />
//         </div>
//     );
// };

// export default SearchBar;


import './SearchBar.css';
import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from '../../../services/Address.js';
import React, { useEffect, useState, useCallback } from 'react';
import { getServiceIndustryTypes, findRepairman, resetError, resetSuccess } from "../../../store/actions/userActions.js";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../Loading/Loading.js";
import Swal from 'sweetalert2';

const SearchBar = ({
    setSelectedRadius,
    selectedRadius,
    onSearch,
    onDataChange
}) => {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const dispatch = useDispatch();

    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [description, setDescription] = useState('');
    const [serviceIndustryId, setServiceIndustryId] = useState('');
    const [imageFiles, setImageFiles] = useState([]);

    const { loading, serviceTypes: serviceTypesFromStore } = useSelector(state => state.user);
    const { successFindRepairman, errorFindRepairman } = useSelector(state => state.user);
    const [serviceTypes, setServiceTypes] = useState([]);

    const [minPrice] = useState("2000000");
    const [maxPrice] = useState("3000000");

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

    useEffect(() => {
        if (serviceTypesFromStore) {
            setServiceTypes(serviceTypesFromStore);
        }
    }, [serviceTypesFromStore]);

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
        debouncedOnDataChange(searchData); // Dùng debounce thay vì gọi trực tiếp
    }, [description, serviceIndustryId, detailAddress, ward, district, city, selectedRadius, debouncedOnDataChange]);

    useEffect(() => {
        if (successFindRepairman) {
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
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

    useEffect(() => {
        if (errorFindRepairman) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
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

    const handleSearchClick = () => {
        const selectedWard = wards.find(w => w.ward_id === ward)?.ward_name || '';
        const selectedDistrict = districts.find(d => d.district_id === district)?.district_name || '';
        const selectedCity = cities.find(c => c.province_id === city)?.province_name || '';

        const address = [detailAddress, selectedWard, selectedDistrict, selectedCity, "Việt Nam"]
            .filter(Boolean)
            .join(", ");

        const requestData = {
            description,
            serviceIndustry_id: serviceIndustryId,
            address,
            radius: selectedRadius ? selectedRadius.value : '',
            minPrice,
            maxPrice,
        };

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
                    value={selectedRadius ? selectedRadius.value : ''}
                    onChange={(e) => {
                        const selectedOption = radiusOptions.find(option => option.value === e.target.value);
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