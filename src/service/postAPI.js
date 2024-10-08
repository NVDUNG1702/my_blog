import axios from "axios";
import { axiosInstance } from "./axiosInstance";
import { BASE_URL } from "./untils";



const postAPI = {
    addPost: async (data) => {
        try {
            const res = await axiosInstance.post('/post/addPost', data);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    },
    getPostByUID: async (username) => {
        try {
            const res = await axios.get(`${BASE_URL}/post/getPostByUID/${username}`);
            return res.data
        } catch (error) {

        }
    }
}

export { postAPI };