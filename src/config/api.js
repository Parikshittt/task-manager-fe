// API Configuration

// Production backend URL (your deployed backend URL)
const PROD_API_URL = 'https://task-manager-be-2.onrender.com'; // Deployed backend URL on Render

// Development backend URL
const DEV_API_URL = 'http://localhost:3000';

// Use production URL when in production mode, otherwise use development URL
const baseURL = import.meta.env.PROD ? PROD_API_URL : DEV_API_URL;

export default baseURL;
