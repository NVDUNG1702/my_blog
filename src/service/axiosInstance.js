import axios from "axios";
import { BASE_URL } from "./untils";




const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // timeout: 4000,
    headers: {
        "Content-Type": 'application/json'
    }
});

const refreshToken = async () => {
    const refToken = localStorage.getItem('refreshToken');
    const response = await axiosInstance.post('user/refresh_token', { refreshToken: refToken },);

    return response;
}


axiosInstance.interceptors.request.use(
    async (config) => {

        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            // console.log(token);
        };


        return config;
    },
    error => {
        // console.log("error request: ", error);

        Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    async (err) => {
        const originalRequest = err.config;
        const { name } = err.response?.data || {};
        const { status } = err.response || {};
        // console.log('status: ', status, 'name: ', err);


        if (status == 401 && name == 'TokenExpiredError') {
            originalRequest._retry = true;
            try {
                const data = await refreshToken();
                // console.log("data rf: ", await data);
                const { token, timeExpired } = data.data?.ACCESS_TOKEN;
                if (token) {
                    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
                    localStorage.setItem('accessToken', token);

                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                return Promise.resolve({ data: { status: 'error', message: 'Unable to refresh token' } });
            }
        }

        // console.log("Error response: ", err);
        return Promise.reject(err);
    }
);



export { axiosInstance }