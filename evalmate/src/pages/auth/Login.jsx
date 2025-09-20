import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import './Login.css';

function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'student'
  });
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(formData.email, formData.password, formData.userType);
    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
    }
  };



  return (
    <div className="login">
      {/* Animated Background */}
      <div className="login__background">
      </div>

      {/* Left Panel - Branding */}
      <div className="login__left-panel">
        <div className="login__brand-container">
          {/* Logo */}
          <div className="login__logo">
            <div className="login__logo-icon">EM</div>
            <div className="login__logo-text">EvalMate</div>
          </div>

          {/* Brand Content */}
          <h1 className="login__brand-title">Transform Your Peer Evaluations</h1>
          <p className="login__brand-subtitle">
            Experience the future of collaborative assessment with our intuitive, 
            secure, and comprehensive peer evaluation platform.
          </p>

          {/* Features */}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login__right-panel">
        <div className="login__form-container">
          {/* Form Header */}
          <div className="login__form-header">
            <h2 className="login__title">Welcome Back</h2>
            <p className="login__subtitle">Sign in to continue your evaluation journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login__error">
              <svg className="login__error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__form-group">
              <div className="login__input-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="login__input"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <svg className="login__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
            </div>

            <div className="login__form-group">
              <div className="login__input-container">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="login__input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <svg className="login__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>

            <div className="login__form-group">
              <select
                id="userType"
                name="userType"
                className="login__select"
                value={formData.userType}
                onChange={handleInputChange}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            <div className="login__forgot-password">
              <a href="#" className="login__forgot-password-link">
                Forgot your password?
              </a>
            </div>

            <div className="login__submit">
              <button
                type="submit"
                className="login__submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="button__loading-spinner" />
                ) : (
                  'Sign In to EvalMate'
                )}
              </button>
            </div>
          </form>



          {/* Register Link */}
          <div className="login__register-link">
            <p>Don't have an account? <Link to="/register">Create one here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;