import { API_ENDPOINTS } from "../constants/api";
import { axiosInstance } from "./axios";

export const updateProfileService = async (userData) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.UPDATE_PROFILE, userData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};