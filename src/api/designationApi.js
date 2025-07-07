import axios from 'axios';
import baseURL from '../config/api';

// Get all designations
export const getAllDesignations = () => {
    return axios.get(`${baseURL}/api/designations`);
};