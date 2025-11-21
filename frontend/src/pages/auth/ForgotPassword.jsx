import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';
import { API_URL } from '../../App';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email, role });
      setMessage('Password reset email sent. Check your inbox.');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending reset email');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Forgot Password</h1>
          <p>Enter your account email to receive reset instructions.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="food-partner">Food Partner</option>
            </select>
          </div>

          <button className="submit-btn">Send Reset Email</button>
        </form>
        {message && <p style={{ marginTop: 12 }}>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
