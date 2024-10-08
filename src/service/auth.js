import axios from "axios"
import { axiosInstance } from "./axiosInstance"
import { BASE_URL } from "./untils"

const authAPI = {
    login: async (email, password) => {
        try {
            const res = await axios.post(`${BASE_URL}/user/login`, { email, password });
            return res.data;
        } catch (error) {
            console.log(error);
            return error;

        }
    },

    register: async (email, password, userName, otp) => {
        try {
            const res = await axios.post(`${BASE_URL}/user/register`, { email, password, userName, otp });
            console.log(res.data, res.status);

            return res;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    sendOTP: async (email, userName) => {
        try {
            const res = await axios.post(`${BASE_URL}/user/senOTP`, { email, userName });
            console.log(res);

            return res.status;
        } catch (error) {
            console.log();
            return error.response.data
        }
    },

    loginWithToken: async () => {
        try {
            const res = await axiosInstance.post(`${BASE_URL}/user/login_with_token`);
            return res.data;
        } catch (error) {
            console.error("Error during login with token:", error);
            return error;
        }
    },

    logOut: async () => {
        try {
            const res = await axiosInstance.post(`${BASE_URL}/user/logout`);
            return res.data;
        } catch (error) {
            return error;
        }
    },

    update: async (data) => {
        try {
            const res = await axiosInstance.put('/user/update', data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (error) {
            console.log(error);

            return error.response.data
        }
    },

    getProfile: async (userName) => {
        try {
            const res = await axiosInstance.get(`${BASE_URL}/user/getProfile/${userName}`);
            return res.data;
        } catch (error) {
            return error.response.data
        }
    },

    checkFollow: async (following) => {
        try {
            const res = await axiosInstance.post(`/user/checkFollow`, { following });
            
            return res.data;
        } catch (error) {
            return error.response.data
        }
    },
    follow: async (following) => {
        try {
            const res = await axiosInstance.post(`/user/follow`, { following });
            return res.data;
        } catch (error) {
            return error.response.data
        }
    }
}

export { authAPI }