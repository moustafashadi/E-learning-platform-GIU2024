import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000" , // Use environment variable for base URL
  withCredentials: true, // Include cookies if needed
});

export default axiosInstance;