import { ENV } from './env'

export const API_ENDPOINTS = {
    EDIT_PROFILE: `${ENV.API_URL}/users/edit-profile`,
    UPLOAD_AVATAR: `${ENV.API_URL}/users/upload-avatar`,
    USERS: `${ENV.API_URL}/users`,
};
