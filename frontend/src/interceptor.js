import axios from 'axios';
import { baseUrl } from './envirnment';

const axiosInstance = axios.create({
    baseURL: baseUrl
})

axiosInstance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        // console.log('local', localStorage.getItem('user'))
        // const local = getLocalStorage('user').data.token
        // console.log(local)
        // config.headers.Authorization = `${local}`;
        config.headers['Access-Control-Allow-Origin'] = '*';
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
)

export default axiosInstance;
