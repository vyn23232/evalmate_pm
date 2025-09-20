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
      {/* Enhanced Header */}
      <div className="faculty-dashboard__header">
        <div className="faculty-dashboard__welcome">
          <div className="faculty-dashboard__title-section">
            <div className="faculty-dashboard__greeting">
              <span className="faculty-dashboard__greeting-text">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}</span>
              <h1 className="faculty-dashboard__title">Faculty Overview</h1>
            </div>
            <p className="faculty-dashboard__subtitle">
              Manage evaluations, monitor submissions, and track student progress
            </p>
            <div className="faculty-dashboard__date-info">
              <span className="faculty-dashboard__date">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          <div className="faculty-dashboard__header-stats">
            <div className="faculty-dashboard__header-stat">
              <span className="faculty-dashboard__header-stat-value">{stats.forms.published}</span>
              <span className="faculty-dashboard__header-stat-label">Active Forms</span>
            </div>
            <div className="faculty-dashboard__header-stat">
              <span className="faculty-dashboard__header-stat-value">{stats.submissions.unread}</span>
              <span className="faculty-dashboard__header-stat-label">New Submissions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Overview Stats */}
      <div className="faculty-dashboard__overview">
        <div className="faculty-dashboard__overview-section">
          <h2 className="faculty-dashboard__section-title">Overview Statistics</h2>
          <div className="faculty-dashboard__stats-grid">
            <Card className="faculty-dashboard__stat-card faculty-dashboard__stat-card--primary">
              <div className="faculty-dashboard__stat">
                <div className="faculty-dashboard__stat-icon faculty-dashboard__stat-icon--forms">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <div className="faculty-dashboard__stat-content">
                  <h3 className="faculty-dashboard__stat-number">{stats.forms.total}</h3>
                  <p className="faculty-dashboard__stat-label">Total Forms</p>
                  <div className="faculty-dashboard__stat-trend">
                    <span className="faculty-dashboard__stat-trend-icon">📈</span>
                    <span>All evaluations</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="faculty-dashboard__stat-card faculty-dashboard__stat-card--success">
              <div className="faculty-dashboard__stat">
                <div className="faculty-dashboard__stat-icon faculty-dashboard__stat-icon--published">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5,3V19L12,16L19,19V3H5M17,5V15.95L12,13.75L7,15.95V5H17Z" />
                  </svg>
                </div>
                <div className="faculty-dashboard__stat-content">
                  <h3 className="faculty-dashboard__stat-number">{stats.forms.published}</h3>
                  <p className="faculty-dashboard__stat-label">Published Forms</p>
                  <div className="faculty-dashboard__stat-trend">
                    <span className="faculty-dashboard__stat-trend-icon">✅</span>
                    <span>Active evaluations</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="faculty-dashboard__stat-card faculty-dashboard__stat-card--info">
              <div className="faculty-dashboard__stat">
                <div className="faculty-dashboard__stat-icon faculty-dashboard__stat-icon--submissions">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9,5V9H15V5H9M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M21,16V4A2,2 0 0,0 19,2H16.82C16.4,0.84 15.3,0 14,0H10C8.7,0 7.6,0.84 7.18,2H5A2,2 0 0,0 3,4V16A2,2 0 0,0 5,18H9.5A6.5,6.5 0 0,0 16,24A6.5,6.5 0 0,0 22.5,17.5A6.5,6.5 0 0,0 16,11C13.5,11 11.42,12.41 10.5,14.5H5V4H7V10H17V4H19V11.35A6.45,6.45 0 0,1 21,16M16,13A4.5,4.5 0 0,1 20.5,17.5A4.5,4.5 0 0,1 16,22A4.5,4.5 0 0,1 11.5,17.5A4.5,4.5 0 0,1 16,13M15,16V19H17V16H15Z" />
                  </svg>
                </div>
                <div className="faculty-dashboard__stat-content">
                  <h3 className="faculty-dashboard__stat-number">{stats.submissions.total}</h3>
                  <p className="faculty-dashboard__stat-label">Total Submissions</p>
                  <div className="faculty-dashboard__stat-trend">
                    <span className="faculty-dashboard__stat-trend-icon">📊</span>
                    <span>All responses</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="faculty-dashboard__stat-card faculty-dashboard__stat-card--warning">
              <div className="faculty-dashboard__stat">
                <div className="faculty-dashboard__stat-icon faculty-dashboard__stat-icon--unread">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21" />
                  </svg>
                </div>
                <div className="faculty-dashboard__stat-content">
                  <h3 className="faculty-dashboard__stat-number">{stats.submissions.unread}</h3>
                  <p className="faculty-dashboard__stat-label">New Submissions</p>
                  <div className="faculty-dashboard__stat-trend">
                    <span className="faculty-dashboard__stat-trend-icon">🔔</span>
                    <span>Requires review</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="faculty-dashboard__stat-card faculty-dashboard__stat-card--secondary">
              <div className="faculty-dashboard__stat">
                <div className="faculty-dashboard__stat-icon faculty-dashboard__stat-icon--rating">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
                  </svg>
                </div>
                <div className="faculty-dashboard__stat-content">
                  <h3 className="faculty-dashboard__stat-number">{stats.submissions.averageRating.toFixed(1)}</h3>
                  <p className="faculty-dashboard__stat-label">Avg Rating</p>
                  <div className="faculty-dashboard__stat-trend">
                    <span className="faculty-dashboard__stat-trend-icon">⭐</span>
                    <span>Overall performance</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="faculty-dashboard__stat-card faculty-dashboard__stat-card--accent">
              <div className="faculty-dashboard__stat">
                <div className="faculty-dashboard__stat-icon faculty-dashboard__stat-icon--today">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
                  </svg>
                </div>
                <div className="faculty-dashboard__stat-content">
                  <h3 className="faculty-dashboard__stat-number">{stats.submissions.todaySubmissions}</h3>
                  <p className="faculty-dashboard__stat-label">Today's Submissions</p>
                  <div className="faculty-dashboard__stat-trend">
                    <span className="faculty-dashboard__stat-trend-icon">📅</span>
                    <span>Recent activity</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
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