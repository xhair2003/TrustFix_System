import axios from "axios";
import { ENV } from "../constants/env";

export const axiosInstance = axios.create({
    baseURL: `${ENV.API_URL}`,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});
