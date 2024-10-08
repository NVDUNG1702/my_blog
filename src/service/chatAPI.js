import { axiosInstance } from "./axiosInstance";


export const chatAPI = {
    getListChat: async () => {
        try {
            const res = await axiosInstance.get(`/chat/getListChat`);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    },

    getMessage: async (userName) => {
        try {
            const res = await axiosInstance.get(`/chat/getMessage/${userName}`);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    },

    sendMessage: async (data) => {
        try {
            const res = await axiosInstance.post(`/chat/sendMessage`, data);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    },
    watchedMessage: async (id) => {
        try {
            const res = await axiosInstance.put(`/chat/watchedMessage`, { id });
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }

}

// watchedMessage