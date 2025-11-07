import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import logo from '../assets/femcloud-logo.jpg';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:4000/api/admin', {
        email,
        password
      });

      if (response.data.success) {
        // Save token in localStorage
        localStorage.setItem('adminToken', response.data.token);
        alert('Login successful!');
        navigate('/dashboard');
      } else {
        alert(response.data.message || 'Invalid credentials');
      }

    } catch (error) {
      console.error('Login error:', error);
      alert('Server error, please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100">
      <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
       
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600 font-display tracking-tight">
          FemCloud Admin
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter admin email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
