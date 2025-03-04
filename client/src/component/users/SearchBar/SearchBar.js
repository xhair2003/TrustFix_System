import './SearchBar.css';
import { apiGetPubliccitys, apiGetPublicDistrict, apiGetPublicWard } from '../../../services/Address.js';
import React, { useEffect, useState } from 'react';

const SearchBar = () => {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
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

    return (
        <div className="search-container">
            <div className="search-top">
                <input type="text" placeholder="Mô tả tình trạng cần sửa chữa" className="search-input-description" />
                <select className="search-dropdown">
                    <option value="">Chọn danh mục</option>
                    <option value="plumber">Thợ sửa ống nước</option>
                    <option value="electrician">Thợ điện</option>
                    <option value="mechanic">Thợ cơ khí</option>
                </select>

                <select className="search-dropdown">
                    <option value="">Chọn bán kính</option>
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="20">20 km</option>
                </select>

                <button className="search-button">Tìm Kiếm</button>
            </div>
            <div className="search-bottom">
                <input type="text" placeholder="Số nhà và tên đường" className="search-input" />

                <select className="search-dropdown" onChange={(e) => setWard(e.target.value)} value={ward}>
                    <option value="">Chọn phường/xã</option>
                    {wards.map((ward) => (
                        <option key={ward.ward_id} value={ward.ward_id}>{ward.ward_name}</option>
                    ))}
                </select>

                <select className="search-dropdown" onChange={(e) => setDistrict(e.target.value)} value={district}>
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                        <option key={district.district_id} value={district.district_id}>{district.district_name}</option>
                    ))}
                </select>

                <select className="search-dropdown" onChange={(e) => setCity(e.target.value)} value={city}>
                    <option value="">Chọn tỉnh/thành phố</option>
                    {cities.map((city) => (
                        <option key={city.province_id} value={city.province_id}>{city.province_name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default SearchBar;
