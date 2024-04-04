import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState(null); 

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            console.log(formData);
            const response = await axios.post('http://localhost:8080/auth/register', formData);
            console.log('Registration successful:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
            setError(error.response.data);
        }
    };

    return (
        <div className="font-[sans-serif] text-[#333] mt-4 p-4 relative">
            <div className="max-w-md w-full mx-auto relative z-50">
                <div className="border border-gray-300 bg-white rounded-md p-8">
                    <form className="w-full">
                        <div className="mb-6">
                            <h3 className="text-2xl font-extrabold text-center">Register</h3>
                        </div>
                        <div className="space-y-6">
                            {error && <div className="text-red-500 text-center">{error}</div>} {/* Display error message */}
                            <div>
                                <label className="text-sm mb-2 block">Username</label>
                                <div className="relative flex items-center">
                                    <input name="username" type="text" required className="bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded outline-blue-500" placeholder="Enter your username" onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm mb-2 block">Email Id</label>
                                <div className="relative flex items-center">
                                    <input name="email" type="email" required className="bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded outline-blue-500" placeholder="Enter your email" onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input name="password" type="password" required className="bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded outline-blue-500" placeholder="Enter your password" onChange={handleChange} />
                                </div>
                            </div>
                            <p className="text-sm mt-6 text-center">Already have an account?
                                <NavLink to="/login" className="text-blue-600 font-semibold hover:underline ml-1">
                                    Login
                                </NavLink>
                            </p>
                        </div>
                        <div className="!mt-5">
                            <button type="button" className="w-full py-3 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none" onClick={handleSubmit}>
                                Create an account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
