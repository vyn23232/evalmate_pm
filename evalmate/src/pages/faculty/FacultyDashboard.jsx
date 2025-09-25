import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FormsManagement from '../../components/faculty/FormsManagement';
import formStore from '../../utils/FormStore';
import evaluationStore from '../../utils/EvaluationStore';
import './FacultyDashboard.css';

function FacultyDashboard() {
  const [stats, setStats] = useState({
    forms: { total: 0, published: 0, drafts: 0 },
    submissions: { total: 0, unread: 0, todaySubmissions: 0, averageRating: 0 }
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load real data from stores
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        const formStats = formStore.getStats();
        const submissionStats = evaluationStore.getStats();
        const recent = evaluationStore.getRecentSubmissions(5);
        
        setStats({
          forms: formStats,
          submissions: submissionStats
        });
        setRecentSubmissions(recent);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Subscribe to updates
    const unsubscribeEval = evaluationStore.subscribe(loadData);
    
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);

    return () => {
      unsubscribeEval();
      clearInterval(interval);
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (

    <div className="faculty-dashboard">
      {/* Minimized Header */}
      <div className="faculty-dashboard__header">
        <div className="faculty-dashboard__welcome">
          <h1 className="faculty-dashboard__title">Faculty Dashboard</h1>
          <p className="faculty-dashboard__subtitle">Create evaluation forms and monitor student submissions.</p>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="faculty-dashboard__main">
        {/* Quick Actions Section */}
        <div className="faculty-dashboard__content-section">
          <div className="faculty-dashboard__section-header">
            <h2 className="faculty-dashboard__section-title">Quick Actions</h2>
            <p className="faculty-dashboard__section-description">
              Manage your evaluations and access key features quickly
            </p>
          </div>
          <div className="faculty-dashboard__quick-actions">
            <Link 
              to="/faculty/forms" 
              className="faculty-dashboard__action-card"
              role="button"
              tabIndex={0}
            >
              <div className="faculty-dashboard__action-icon faculty-dashboard__action-icon--primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <div className="faculty-dashboard__action-content">
                <h3>Create New Evaluation</h3>
                <p>Design and publish evaluation forms for your students</p>
              </div>
              <div className="faculty-dashboard__action-arrow">→</div>
            </Link>

            <Link 
              to="/faculty/reports" 
              className="faculty-dashboard__action-card"
              role="button"
              tabIndex={0}
            >
              <div className="faculty-dashboard__action-icon faculty-dashboard__action-icon--success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M17,12H12V17H17V12M7,12H10V17H7V12M10,10V7H7V10H10M12,10H17V7H12V10Z" />
                </svg>
              </div>
              <div className="faculty-dashboard__action-content">
                <h3>View Reports</h3>
                <p>Analyze submission reports and performance data</p>
              </div>
              <div className="faculty-dashboard__action-arrow">→</div>
            </Link>

            <div 
              className="faculty-dashboard__action-card faculty-dashboard__action-card--disabled"
              title="Coming soon - Evaluation settings will be available in a future update"
            >
              <div className="faculty-dashboard__action-icon faculty-dashboard__action-icon--secondary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                </svg>
              </div>
              <div className="faculty-dashboard__action-content">
                <h3>Evaluation Settings</h3>
                <p>Configure evaluation parameters and preferences</p>
              </div>
              <div className="faculty-dashboard__action-arrow">→</div>
            </div>
          </div>
        </div>

        {/* Recent Submissions Section */}
        <div className="faculty-dashboard__content-section">
          <div className="faculty-dashboard__section-header">
            <h2 className="faculty-dashboard__section-title">Recent Activity</h2>
            <p className="faculty-dashboard__section-description">
              Latest submissions from your students
            </p>
          </div>
          
          {isLoading ? (
            <div className="faculty-dashboard__loading">
              <div className="faculty-dashboard__loading-spinner"></div>
              <span>Loading submissions...</span>
            </div>
          ) : recentSubmissions.length === 0 ? (
            <div className="faculty-dashboard__empty-state">
              <div className="faculty-dashboard__empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <h3>No submissions yet</h3>
              <p>Student evaluation submissions will appear here once forms are completed and submitted.</p>
              <Link to="/faculty/forms">
                <Button variant="primary">
                  Create Your First Form
                </Button>
              </Link>
            </div>
          ) : (
            <div className="faculty-dashboard__submissions">
              <div className="faculty-dashboard__submissions-list">
                {recentSubmissions.map((submission) => (
                  <div 
                    key={submission.id} 
                    className={`faculty-dashboard__submission-item ${!submission.isRead ? 'faculty-dashboard__submission-item--unread' : ''}`}
                  >
                    <div className="faculty-dashboard__submission-avatar">
                      <div className="faculty-dashboard__submission-initials">
                        {submission.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="faculty-dashboard__submission-info">
                      <div className="faculty-dashboard__submission-header">
                        <h4 className="faculty-dashboard__submission-title">{submission.formTitle}</h4>
                        <span className="faculty-dashboard__submission-time">{formatDate(submission.submittedAt)}</span>
                      </div>
                      <p className="faculty-dashboard__submission-student">
                        <strong>{submission.studentName}</strong> • Team {submission.teamId}
                      </p>
                      <div className="faculty-dashboard__submission-meta">
                        <span className="faculty-dashboard__meta-item">
                          <span className="faculty-dashboard__meta-icon">👥</span>
                          {submission.teammates.length} teammates
                        </span>
                        <span className="faculty-dashboard__meta-item">
                          <span className="faculty-dashboard__meta-icon">⭐</span>
                          {submission.metadata.avgRating}/5 avg
                        </span>
                        {!submission.isRead && (
                          <span className="faculty-dashboard__unread-badge">New</span>
                        )}
                      </div>
                    </div>
                    <div className="faculty-dashboard__submission-actions">
                      <Link to="/faculty/reports">
                        <Button variant="ghost" size="small">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="faculty-dashboard__view-all">
                <Link to="/faculty/reports">
                  <Button variant="secondary" size="large">
                    View All Submissions
                    <span className="faculty-dashboard__view-all-arrow">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forms Management Section */}
      <div className="faculty-dashboard__forms-section">
        <FormsManagement />
      </div>
    </div>
  );
}

export default FacultyDashboard;