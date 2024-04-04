import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
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
      const response = await axios.post('http://localhost:8080/auth/login', formData);
      console.log('Login successful:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response.data);
    }
  };

  return (
    <div className="bg-gray-50 text-[#333]">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-md w-full border py-8 px-6 rounded border-gray-300 bg-white">
          <h2 className="text-center text-3xl font-extrabold">
            Login
          </h2>
          <form className="mt-10 space-y-4">
            <div>
              <input name="username" type="text" required className="w-full text-sm px-4 py-3 rounded outline-none border-2 focus:border-blue-500" placeholder="Username" onChange={handleChange} />
            </div>
            <div>
              <input name="password" type="password" autoComplete="current-password" required className="w-full text-sm px-4 py-3 rounded outline-none border-2 focus:border-blue-500" placeholder="Password" onChange={handleChange} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                Don&apos;t have an account?&nbsp;
                <NavLink to="/register" className="text-indigo-600 transition-all duration-200 hover:underline">
                  Register
                </NavLink>
              </div>
            </div>
            <div className="!mt-10">
              <button type="button" className="font-bold w-full py-2.5 px-4 text-sm rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none" onClick={handleSubmit}>
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
