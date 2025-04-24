// import axios from 'axios'

// export const apiGetPubliccitys = async () => {
//     try {
//         const response = await axios.get('https://vapi.vnappmob.com/api/province/')
//         return response
//     } catch (error) {
//         throw error
//     }
// }

// export const apiGetPublicDistrict = async (provinceId) => {
//     try {
//         const response = await axios.get(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
//         return response
//     } catch (error) {
//         throw error
//     }
// }

// export const apiGetPublicWard = async (districtId) => {
//     try {
//         const response = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)
//         return response
//     } catch (error) {
//         throw error
//     }
// }


import axios from 'axios';

const BASE_URL = 'https://provinces.open-api.vn/api/';

// Lấy danh sách tỉnh/thành phố
export const apiGetPublicCities = async () => {
    try {
        const response = await axios.get(`${BASE_URL}p/`);
        console.log('Cities:', response.data);
        return response.data; // Trả về [{ name, code, division_type, codename, phone_code }, ...]
    } catch (error) {
        console.error('Error fetching cities:', error.response?.status, error.response?.data);
        throw new Error('Failed to fetch cities');
    }
};

// Lấy danh sách quận/huyện theo tỉnh
export const apiGetPublicDistrict = async (provinceCode) => {
    if (!provinceCode) throw new Error('provinceCode is required');
    try {
        const response = await axios.get(`${BASE_URL}p/${provinceCode}?depth=2`);
        console.log('Districts:', response.data.districts);
        return response.data.districts || []; // Trả về [{ name, code, division_type, codename, wards }, ...]
    } catch (error) {
        console.error('Error fetching districts:', error.response?.status, error.response?.data);
        throw new Error('Failed to fetch districts');
    }
};

// Lấy danh sách phường/xã theo huyện
export const apiGetPublicWard = async (districtCode) => {
    if (!districtCode) throw new Error('districtCode is required');
    try {
        const response = await axios.get(`${BASE_URL}d/${districtCode}?depth=2`);
        console.log('Wards:', response.data.wards);
        return response.data.wards || []; // Trả về [{ name, code, division_type, codename }, ...]
    } catch (error) {
        console.error('Error fetching wards:', error.response?.status, error.response?.data);
        throw new Error('Failed to fetch wards');
    }
};


// import axios from 'axios';

// const BASE_URL = 'https://provinces.open-api.vn/api/';

// export const getProvinces = async () => {
//   const response = await axios.get(`${BASE_URL}p/`);
//   return response.data;
// };

// export const getDistricts = async (provinceCode) => {
//   const response = await axios.get(`${BASE_URL}p/${provinceCode}?depth=2`);
//   return response.data.districts;
// };

// export const getWards = async (districtCode) => {
//   const response = await axios.get(`${BASE_URL}d/${districtCode}?depth=2`);
//   return response.data.wards;
// };