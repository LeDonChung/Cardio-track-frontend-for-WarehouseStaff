import axios, { AxiosInstance } from "axios";


const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Add an interceptor to include the authorization token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        localStorage.removeItem('token');
        return Promise.reject(error);
    }
);

export { axiosInstance };