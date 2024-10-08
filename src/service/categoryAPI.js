import axios from "axios";
import { axiosInstance } from "./axiosInstance";
import { BASE_URL } from "./untils";


export const categoryAPI = {
    getAllTopic: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/category/getAllTopic`);
            console.log(res);

            return {
                status: res.status,
                data: res.data.data
            }
        } catch (error) {
            return {
                status: error.response.status,
                error: error.response.data.error
            }
        }
    }
}

