import axios from "axios";
import { axiosInstance } from "./axiosInstance";
import { BASE_URL } from "./untils";


export const noteAPI = {
    addNote: async (data) => {
        try {
            const res = await axiosInstance.post('/note/addNote', data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return res.data;

        } catch (error) {
            console.log("error add note: ", error);

            return error.response.data;
        }
    },
    getNoteByUName: async (username) => {
        try {
            const res = await axios.get(`${BASE_URL}/note/getNoteByUserName/${username}`);
            return res.data
        } catch (error) {
            return error.response.data;
        }
    },
    likeNote: async (id) => {
        try {
            const res = await axiosInstance.post(`/note/likeNote`, { idNote: id });
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    },
    checkLike: async (id) => {
        try {
            const res = await axiosInstance.post(`/note/checkLike`, { idNote: id });
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    },

    deleteNoteByID: async (id) => {
        try {
            const res = await axiosInstance.delete(`/note/deleteNoteByID/${id}`);
            return res.data
        } catch (error) {
            return error.response.data;
        }
    },

    getNoteByID: async (id) => {
        try {
            const res = await axios.get(`${BASE_URL}/note/getNoteByID/${id}`);
            return res.data
        } catch (error) {
            return error.response.data;
        }
    },

    addComment: async (data) => {
        try {
            const res = await axiosInstance.post(`/note/addComment`, data);
            return res.data
        } catch (error) {
            return error.response.data;
        }
    },

    deleteComments: async (id) => {
        try {
            const res = await axiosInstance.delete(`/note/deleteComments/${id}`);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }
}
