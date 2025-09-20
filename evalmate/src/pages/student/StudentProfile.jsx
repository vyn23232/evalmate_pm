import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './StudentProfile.css';

function StudentProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: '',
    
    // Academic Information
    studentId: user?.studentId || '',
    major: '',
    year: '',
    expectedGraduation: '',
    gpa: '',
    

    
    // Privacy Settings
    profileVisibility: 'group-members',
    showPerformanceStats: true,
    allowPeerContact: true
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would make actual API calls to update user profile
      // Example: await updateUserProfile(formData, profileImage);
      
      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'JD';
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'academic', label: 'Academic', icon: '🎓' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  return (
    <div className="student-profile">
      <div className="student-profile__header">
        <h1 className="student-profile__title">My Profile</h1>
        <p className="student-profile__subtitle">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Image Section */}
      <Card className="student-profile__image-section">
        <div className="student-profile__image-container">
          <div className="student-profile__avatar-wrapper">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Profile" 
                className="student-profile__avatar-image"
              />
            ) : (
              <div className="student-profile__avatar-placeholder">
                {getInitials(formData.firstName + ' ' + formData.lastName)}
              </div>
            )}
            <label className="student-profile__avatar-overlay">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="student-profile__file-input"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </label>
          </div>
          <div className="student-profile__image-info">
            <h3>Profile Picture</h3>
            <p>Upload a photo to personalize your profile. JPG, PNG up to 5MB.</p>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="student-profile__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`student-profile__tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="student-profile__tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="student-profile__form">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <Card title="Personal Information" subtitle="Your basic personal details">
            <div className="student-profile__form-grid">
              <div className="student-profile__form-group">
                <label className="student-profile__label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="student-profile__input"
                  required
                />
              </div>
              
              <div className="student-profile__form-group">
                <label className="student-profile__label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="student-profile__input"
                  required
                />
              </div>
              
              <div className="student-profile__form-group">
                <label className="student-profile__label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="student-profile__input"
                  required
                />
              </div>
              
              <div className="student-profile__form-group">
                <label className="student-profile__label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="student-profile__input"
                />
              </div>
              
              <div className="student-profile__form-group">
                <label className="student-profile__label">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="student-profile__input"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Academic Information Tab */}
        {activeTab === 'academic' && (
          <Card title="Academic Information" subtitle="Your academic details and progress">
            <div className="student-profile__form-grid">
              <div className="student-profile__form-group">
                <label className="student-profile__label">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="student-profile__input"
                  disabled
                />
                <span className="student-profile__help-text">Student ID cannot be changed</span>
              </div>
              
              <div className="student-profile__form-group">
                <label className="student-profile__label">Major</label>
                <select
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="student-profile__select"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>
              
              <div className="student-profile__form-group">
                <label className="student-profile__label">Academic Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="student-profile__select"
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              
              <div className="student-profile__form-group">
                <label className="student-profile__label">Expected Graduation</label>
                <input
                  type="date"
                  name="expectedGraduation"
                  value={formData.expectedGraduation}
                  onChange={handleInputChange}
                  className="student-profile__input"
                />
              </div>
              
              <div className="student-profile__form-group">
                <label className="student-profile__label">Current GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.00"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  className="student-profile__input"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="student-profile__preferences">
            <Card title="Privacy Settings" subtitle="Control your profile visibility">
              <div className="student-profile__form-grid">
                <div className="student-profile__form-group">
                  <label className="student-profile__label">Profile Visibility</label>
                  <select
                    name="profileVisibility"
                    value={formData.profileVisibility}
                    onChange={handleInputChange}
                    className="student-profile__select"
                  >
                    <option value="public">Public - Anyone can view</option>
                    <option value="group-members">Group Members Only</option>
                    <option value="instructors">Instructors Only</option>
                    <option value="private">Private - Only me</option>
                  </select>
                </div>
              </div>
              
              <div className="student-profile__checkbox-group">
                <label className="student-profile__checkbox-label">
                  <input
                    type="checkbox"
                    name="showPerformanceStats"
                    checked={formData.showPerformanceStats}
                    onChange={handleInputChange}
                    className="student-profile__checkbox"
                  />
                  <span className="student-profile__checkbox-text">
                    <strong>Show Performance Statistics</strong>
                    <span>Allow others to see your evaluation ratings</span>
                  </span>
                </label>
                
                <label className="student-profile__checkbox-label">
                  <input
                    type="checkbox"
                    name="allowPeerContact"
                    checked={formData.allowPeerContact}
                    onChange={handleInputChange}
                    className="student-profile__checkbox"
                  />
                  <span className="student-profile__checkbox-text">
                    <strong>Allow Peer Contact</strong>
                    <span>Let group members contact you directly</span>
                  </span>
                </label>
              </div>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card title="Security Settings" subtitle="Manage your account security">
            <div className="student-profile__security-section">
              <div className="student-profile__security-item">
                <div className="student-profile__security-info">
                  <h3>Password</h3>
                  <p>Last changed 30 days ago</p>
                </div>
                <Button variant="secondary" size="small">
                  Change Password
                </Button>
              </div>
              
              <div className="student-profile__security-item">
                <div className="student-profile__security-info">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <Button variant="secondary" size="small">
                  Enable 2FA
                </Button>
              </div>
              
              <div className="student-profile__security-item">
                <div className="student-profile__security-info">
                  <h3>Active Sessions</h3>
                  <p>Manage devices that have access to your account</p>
                </div>
                <Button variant="secondary" size="small">
                  View Sessions
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Save Status */}
        {saveStatus && (
          <div className={`student-profile__status student-profile__status--${saveStatus}`}>
            {saveStatus === 'success' ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                </svg>
                Profile updated successfully!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                Failed to update profile. Please try again.
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="student-profile__actions">
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Saving Changes...' : 'Save Changes'}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              // Reset form to original values
              setFormData({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phone: user?.phone || '',
                dateOfBirth: '',
                studentId: user?.studentId || '',
                major: '',
                year: '',
                expectedGraduation: '',
                gpa: '',

                profileVisibility: 'group-members',
                showPerformanceStats: true,
                allowPeerContact: true
              });
              setSaveStatus(null);
            }}
          >
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StudentProfile;