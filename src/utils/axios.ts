import axios from "axios";

const BASE_URL = "https://isdl.vercel.app/";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export { axiosInstance as axios };