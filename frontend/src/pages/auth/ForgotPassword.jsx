import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/auth.css'
import axios from 'axios'
import { API_URL } from '../../App';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('user'); // 'user' or 'foodpartner'

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = userType === 'user' 
        ? '/api/auth/user/forgot-password' 
        : '/api/auth/food-partner/forgot-password';
      
      await axios.post(`${API_URL}${endpoint}`, { email });
      setSuccess('OTP sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = userType === 'user' 
        ? '/api/auth/user/verify-otp' 
        : '/api/auth/food-partner/verify-otp';
      
      await axios.post(`${API_URL}${endpoint}`, { email, otp });
      setSuccess('OTP verified. Enter your new password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const endpoint = userType === 'user' 
        ? '/api/auth/user/reset-password' 
        : '/api/auth/food-partner/reset-password';
      
      await axios.post(`${API_URL}${endpoint}`, { email, otp, newPassword });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate(userType === 'user' ? '/user/login' : '/food-partner/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Follow the steps to reset your password</p>
        </div>

        {error && <div style={{ color: '#d32f2f', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}
        {success && <div style={{ color: '#388e3c', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>{success}</div>}

        {/* User Type Selection */}
        {step === 1 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label>Are you a:</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  name="userType"
                  value="user"
                  checked={userType === 'user'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Regular User
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  name="userType"
                  value="foodpartner"
                  checked={userType === 'foodpartner'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Food Partner
              </label>
            </div>
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-input"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              style={{ marginTop: '0.5rem', background: 'transparent', color: 'var(--primary-color)', cursor: 'pointer' }}
            >
              Back
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Confirm password"
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="auth-footer">
          Remember your password?{' '}
          <Link to="/user/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
