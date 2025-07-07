import axios from 'axios';
import baseURL from '../config/api';

// Get all roles
export const getAllRoles = () => {
    return axios.get(`${baseURL}/api/roles`);
};