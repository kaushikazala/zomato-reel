import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios';
import { API_URL } from '../../App';

const FoodPartnerLogin = () => {
  const navigate = useNavigate();

  // Controlled inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/food-partner/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data); // for debugging
      navigate('/create-food'); // redirect after successful login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Partner Login</h1>
          <p>Access your dashboard and manage orders.</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          New partner? <Link to="/food-partner/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
