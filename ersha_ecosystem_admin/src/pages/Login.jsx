import React, { useState } from 'react';
import { authAPI } from '../lib/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }

      // Use real API login
      const response = await authAPI.login(email, password);
      console.log('Login successful:', response);
      
      // Call the onLogin callback
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md flex flex-col gap-6 border border-green-100"
      >
        <h2 className="text-2xl font-bold text-green-900 text-center">Admin Login</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-green-900">Email</label>
          <input
            id="email"
            type="email"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-green-900">Password</label>
          <input
            id="password"
            type="password"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
          />
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className={`bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
