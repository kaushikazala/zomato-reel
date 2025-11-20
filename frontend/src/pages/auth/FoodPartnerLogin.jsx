import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.API_URL

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const email = formData.get('email');
    const password = formData.get('password');  
    const rememberMe = formData.get('rememberMe') === 'on';

    const response = await axios.post(`${API}/api/auth/food-partner/login`, {
      email,
      password,
      rememberMe
    },{
      withCredentials:true 
    })
    navigate("/create-food");
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Partner Login</h1>
          <p>Sign in to your business account</p>
        </div>

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
                checked={FoodPartnerLogin.rememberMe}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="#" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }}>
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Sign In
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        {/* Social Login */}
        <button type="button" className="social-btn">
          Continue with Google
        </button>

        {/* Footer */}
        <div className="auth-footer">
          New to our platform?{' '}
          <Link to="/food-partner/register">Register your business</Link>
        </div>
      </div>
    </div>
  )
}

export default FoodPartnerLogin
