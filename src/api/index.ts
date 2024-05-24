import axios, { AxiosRequestConfig } from "axios"

const axiosDefaults: AxiosRequestConfig = {
    baseURL: 'http://api.weatherapi.com/',
    params: {
        key: import.meta.env.VITE_WEATHER_API_KEY
    }
}

const api = axios.create(axiosDefaults)

export default api