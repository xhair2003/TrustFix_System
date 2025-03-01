import axios from 'axios'

export const apiGetPubliccitys = async () => {
    try {
        const response = await axios.get('https://vapi.vnappmob.com/api/v2/province/')
        return response
    } catch (error) {
        throw error
    }
}

export const apiGetPublicDistrict = async (provinceId) => {
    try {
        const response = await axios.get(`https://vapi.vnappmob.com/api/v2/province/district/${provinceId}`)
        return response
    } catch (error) {
        throw error
    }
}

export const apiGetPublicWard = async (districtId) => {
    try {
        const response = await axios.get(`https://vapi.vnappmob.com/api/v2/province/ward/${districtId}`)
        return response
    } catch (error) {
        throw error
    }
}
