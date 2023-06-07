import axios from 'axios';

const ApiManager = axios.create({
    // baseURL: 'https://localhost:44326',
    baseURL: 'http://10.0.2.2:3000/',
    responseType: 'json',
    withCredentials: true,
});


export default ApiManager;