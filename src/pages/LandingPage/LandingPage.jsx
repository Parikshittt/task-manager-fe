import React, { useState, useEffect } from 'react';
import './LandingPage.css';
// Add additional CSS for the role note
import { login, signup } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAllDesignations } from '../../api/designationApi';
import { getAllRoles } from '../../api/rolesApi';
import { setDesignations, setRoles } from '../../features/designation/designationAndRoleSlice';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader/Loader';
export default function LandingPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        role: ''
    });
    const dispatch = useDispatch();
    const designations = useSelector((state) => state.designationAndRoles.designations) || [];
    const roles = useSelector((state) => state.designationAndRoles.roles) || [];
    console.log("designations without API -->", designations);
    console.log("roles without API -->", roles);

    useEffect(() => {
        const fetchDesignationsAndRoles = async () => {
            try {
                const [designationsResponse, rolesResponse] = await Promise.all([
                    getAllDesignations(),
                    getAllRoles(),
                ]);
                dispatch(setDesignations(designationsResponse.data.designations));
                dispatch(setRoles(rolesResponse.data));
                console.log("designations with API -->", designationsResponse.data.designations);
                console.log("roles with API -->", rolesResponse.data);
            } catch (error) {
                console.error('Error fetching designations and roles:', error);
            }
        };
        if (designations.length === 0 && roles.length === 0) {
            fetchDesignationsAndRoles();
        }
    }, [designations, roles, dispatch]);

    // Check if user is already logged in
    useEffect(() => {
        const currentUser = localStorage.getItem('currentEmp');
        if (currentUser && currentUser !== 'null') {
            // User is already logged in, redirect to projects page
            navigate('/projects');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLoginApi = async (username, password) => {
        setIsLoading(true);
        try {
            const response = await login(username, password);
            console.log('Login API response:', response.data);
            // Store user info in localStorage
            localStorage.setItem('currentEmp', response.data.user.id);
            // Store additional user info if needed
            if (response.data.user) {
                localStorage.setItem('userName', response.data.user.name || '');
                localStorage.setItem('userRole', response.data.user.role || '');
            }
            navigate('/projects');
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login failed. Please check your credentials and try again.');
            setIsLoading(false); // Reset loading state on error
        }
        // Note: we don't reset loading state on success because we're navigating away
    }

    const handleSignupApi = async (userData) => {
        setIsLoading(true);
        try {
            // Hardcode role as 'Cadet' with value 5 in the payload
            const payloadWithRole = {
                ...userData,
                role: 5 // Hardcoded role value for 'Cadet'
            };
            
            const response = await signup(payloadWithRole);
            console.log('Signup API response:', response.data);

            // Store user info in localStorage, just like login
            localStorage.setItem('currentEmp', response.data.id);
            if (response.data) {
                localStorage.setItem('userName', response.data.name || '');
                localStorage.setItem('userRole', response.data.role || '');
            }

            // Redirect to projects page
            navigate('/projects');
        } catch (error) {
            console.error('Error signing up:', error);
            alert('Signup failed. ' + (error.response?.data?.message || 'Please try again.'));
            setIsLoading(false); // Reset loading state on error
        }
        // Note: we don't reset loading state on success because we're navigating away
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            console.log('Login data:', { username: formData.username, password: formData.password });
            handleLoginApi(formData.username, formData.password);
        } else {
            console.log('Signup data:', formData);
            handleSignupApi(formData);
        }
    };

    return (
        <div className="landing-page">
            {(designations.length > 0 && roles.length > 0) ? <div className="form-card">
                <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
                <form onSubmit={handleSubmit}>
                    {['username', 'password', ...(!isLogin ? ['name', 'role'] : [])].map((field) => (
                        <div key={field} className="form-group">
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                            <input
                                type={field === 'password' ? 'password' : 'text'}
                                name={field}
                                value={field === 'role' ? 'Cadet' : formData[field]}
                                onChange={handleInputChange}
                                required
                                disabled={field === 'role'}
                            />
                            {field === 'role' && !isLogin && (
                                <p className="role-note">Please contact your IT team or HR department to update your role as needed.</p>
                            )}
                        </div>
                    ))}
                    <button type="submit" className="primary-btn" disabled={isLoading}>
                        {isLoading ? (
                            <span className="button-with-loader">
                                <span>{isLogin ? 'Logging in...' : 'Signing up...'}</span>
                                <span className="inline-loader-container">
                                    <div className="loader loader-small"></div>
                                </span>
                            </span>
                        ) : (
                            isLogin ? 'Login' : 'Sign Up'
                        )}
                    </button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} className="secondary-btn">
                    {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                </button>
            </div> : <div className="form-card">
                <Loader size="medium" />
            </div>}
        </div>
    );


}