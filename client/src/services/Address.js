import axios from 'axios'

export const apiGetPubliccitys = async () => {
    try {
        const response = await axios.get('https://vapi.vnappmob.com/api/province/')
        return response
    } catch (error) {
        throw error
    }
}

export const apiGetPublicDistrict = async (provinceId) => {
    try {
        const response = await axios.get(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
        return response
    } catch (error) {
        throw error
    }
}

export const apiGetPublicWard = async (districtId) => {
    try {
        const response = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)
        return response
    } catch (error) {
        throw error
    }
}



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