import React, { use, useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import '../../styles/auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { API_URL } from '../../App';

const API = import.meta.env.API_URL

const UserLogin = () => {

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');
      const rememberMe = formData.get('rememberMe') === 'on';

      const response = await axios.post(`${API_URL}/api/auth/user/login`, {
        email,
        password,
        rememberMe
      },{
        withCredentials:true 
      })
      console.log(response);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/user/google-login`,
        { token: credentialResponse.credential },
        { withCredentials: true }
      );
      console.log(response);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  }
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {error && <div style={{ color: '#d32f2f', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
              <div className="form-checkbox" style={{ marginBottom: 0 }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link to="/forgot-password" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          {/* Social Login */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          {/* Footer */}
          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/user/register">Create one</Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default UserLogin
