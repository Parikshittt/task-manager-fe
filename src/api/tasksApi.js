import axios from 'axios';

const baseURL = 'http://localhost:3000';

// Get all tasks
export const getAllTasks = () => {
    return axios.get(`${baseURL}/api/tasks`);
};

// Get a specific task by ID
export const getTaskById = (id) => {
    return axios.get(`${baseURL}/api/tasks/${id}`);
};

// Create a new task
export const createTask = (taskData) => {
    return axios.post(`${baseURL}/api/tasks`, taskData);
};

// Update an existing task
export const updateTask = (id, taskData) => {
    return axios.put(`${baseURL}/api/tasks/${id}`, taskData);
};

// Delete a task
export const deleteTask = (id) => {
    return axios.delete(`${baseURL}/api/tasks/${id}`);
};