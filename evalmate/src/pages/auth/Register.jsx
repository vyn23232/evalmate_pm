import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    studentId: '',
    employeeId: '',
    institution: '',
    department: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    // Role-specific validation
    if (formData.userType === 'student' && !formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    
    if (formData.userType === 'faculty' && !formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register(formData);
      
      if (result.success) {
        // Navigate to appropriate dashboard based on user type
        const redirectPath = formData.userType === 'faculty' ? '/faculty' : '/student';
        navigate(redirectPath);
      } else {
        setErrors({ submit: result.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        {/* Brand Section */}
        <div className="register__brand-section">
          <div className="register__logo">
            <h1 className="register__brand-title">EvalMate</h1>
            <p className="register__brand-subtitle">
              Streamlined peer evaluation system for academic institutions
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="register__form-section">
          <div className="register__form-header">
            <h1 className="register__title">Create Account</h1>
            <p className="register__subtitle">Join EvalMate to get started with peer evaluations</p>
          </div>

          {/* Registration Form */}
          <form className="register__form" onSubmit={handleSubmit}>
            <div className="register__form-grid">
              {errors.submit && (
                <div className="register__error-banner">
                  {errors.submit}
                </div>
              )}

              {/* User Type Selection */}
              <div className="register__field register__field--full">
                <label className="register__label">Account Type</label>
                <div className="register__user-type">
                  <label className="register__radio-option">
                    <input
                      type="radio"
                      name="userType"
                      value="student"
                      checked={formData.userType === 'student'}
                      onChange={handleInputChange}
                    />
                    <span className="register__radio-label">Student</span>
                  </label>
                  <label className="register__radio-option">
                    <input
                      type="radio"
                      name="userType"
                      value="faculty"
                      checked={formData.userType === 'faculty'}
                      onChange={handleInputChange}
                    />
                    <span className="register__radio-label">Faculty</span>
                  </label>
                </div>
              </div>

              {/* Personal Information */}
              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`register__input ${errors.firstName ? 'register__input--error' : ''}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <span className="register__error">{errors.firstName}</span>}
                </div>
                
                <div className="register__field">
                  <label className="register__label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`register__input ${errors.lastName ? 'register__input--error' : ''}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <span className="register__error">{errors.lastName}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="register__field register__field--full">
                <label className="register__label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`register__input ${errors.email ? 'register__input--error' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.email && <span className="register__error">{errors.email}</span>}
              </div>

              {/* Password Fields */}
              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">Password</label>
                  <div className="register__password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`register__input ${errors.password ? 'register__input--error' : ''}`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="register__password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && <span className="register__error">{errors.password}</span>}
                </div>
                
                <div className="register__field">
                  <label className="register__label">Confirm Password</label>
                  <div className="register__password-field">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`register__input ${errors.confirmPassword ? 'register__input--error' : ''}`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="register__password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="register__error">{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* ID Fields */}
              <div className="register__row">
                {formData.userType === 'student' ? (
                  <div className="register__field">
                    <label className="register__label">Student ID</label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className={`register__input ${errors.studentId ? 'register__input--error' : ''}`}
                      placeholder="Enter your student ID"
                    />
                    {errors.studentId && <span className="register__error">{errors.studentId}</span>}
                  </div>
                ) : (
                  <div className="register__field">
                    <label className="register__label">Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      className={`register__input ${errors.employeeId ? 'register__input--error' : ''}`}
                      placeholder="Enter your employee ID"
                    />
                    {errors.employeeId && <span className="register__error">{errors.employeeId}</span>}
                  </div>
                )}
                
                <div className="register__field">
                  <label className="register__label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="register__input"
                    placeholder="Enter your phone number (optional)"
                  />
                </div>
              </div>

              {/* Institution & Department */}
              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">Institution</label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className={`register__input ${errors.institution ? 'register__input--error' : ''}`}
                    placeholder="Enter your institution name"
                  />
                  {errors.institution && <span className="register__error">{errors.institution}</span>}
                </div>
                
                <div className="register__field">
                  <label className="register__label">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`register__input ${errors.department ? 'register__input--error' : ''}`}
                    placeholder="Enter your department"
                  />
                  {errors.department && <span className="register__error">{errors.department}</span>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="register__submit">
                <button
                  type="submit"
                  className="register__submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          </form>

          {/* Login Link */}
          <div className="register__login-link">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;