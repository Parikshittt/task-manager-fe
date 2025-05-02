import axios from 'axios';

const baseURL = 'http://localhost:3000';

export const login = (username, password) => {
    return axios.post(`${baseURL}/api/auth/login`, {
        username,
        password,
    });
};

export const signup = (userData) => {
    return axios.post(`${baseURL}/api/auth/signup`, userData);
};

export const getAllUsers = () => {
    return axios.get(`${baseURL}/api/users`);
}