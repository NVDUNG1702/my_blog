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

    sendOTP: async (email) => {
        try {
            const res = await axios.post(`${BASE_URL}/user/senOTP`, { email });
            console.log(res);

            return res.status;
        } catch (error) {
            console.log();
            return error.response.data
        }
    },

    loginWithToken: async ()=>{
        try {
            const res = await axiosInstance.post(`${BASE_URL}/user/login_with_token`);
            return res.data;
        } catch (error) {
            return error
        }
    }
}

export { authAPI }