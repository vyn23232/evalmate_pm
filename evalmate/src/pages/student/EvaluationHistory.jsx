import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import evaluationStore from '../../utils/EvaluationStore';
import './EvaluationHistory.css';

function EvaluationHistory() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, recent, course
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    loadHistory();

    // Subscribe to updates
    const unsubscribe = evaluationStore.subscribe ? evaluationStore.subscribe(loadHistory) : () => {};
    
    return () => {
      unsubscribe();
    };
  }, []);

  const loadHistory = () => {
    setIsLoading(true);
    try {
      // Get submissions by the current student
      const userSubmissions = evaluationStore.getSubmissionsByStudent(user?.email || user?.id || user?.name);
      setSubmissions(userSubmissions);
    } catch (error) {
      console.error('Error loading evaluation history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique courses for filtering
  const courses = [...new Set(submissions.map(sub => sub.course))].filter(Boolean);

  // Filter submissions based on selected filters
  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true;
    if (filter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(submission.submittedAt) > weekAgo;
    }
    if (filter === 'course') {
      return submission.course === selectedCourse;
    }
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${diffDays} days ago`;
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
  };

  const closeDetails = () => {
    setSelectedSubmission(null);
  };

  const getSubmissionStats = () => {
    if (submissions.length === 0) return { total: 0, avgRating: 0, totalTeammates: 0 };
    
    const total = submissions.length;
    const avgRating = submissions.reduce((sum, sub) => sum + sub.metadata.avgRating, 0) / total;
    const totalTeammates = submissions.reduce((sum, sub) => sum + sub.metadata.totalTeammates, 0);
    
    return {
      total,
      avgRating: Math.round(avgRating * 10) / 10,
      totalTeammates
    };
  };

  const stats = getSubmissionStats();

  return (
    <div className="evaluation-history">
      {/* Header */}
      <div className="evaluation-history__header">
        <div className="evaluation-history__title-section">
          <h1 className="evaluation-history__title">Evaluation History</h1>
          <p className="evaluation-history__subtitle">
            View all your completed peer evaluations and their details
          </p>
        </div>
      </div>

      {/* Statistics Summary */}
      {submissions.length > 0 && (
        <div className="evaluation-history__stats">
          <Card className="evaluation-history__stat-card">
            <div className="evaluation-history__stat">
              <div className="evaluation-history__stat-icon">📊</div>
              <div className="evaluation-history__stat-content">
                <h3>{stats.total}</h3>
                <p>Total Submissions</p>
              </div>
            </div>
          </Card>

          <Card className="evaluation-history__stat-card">
            <div className="evaluation-history__stat">
              <div className="evaluation-history__stat-icon">⭐</div>
              <div className="evaluation-history__stat-content">
                <h3>{stats.avgRating}/5</h3>
                <p>Average Rating Given</p>
              </div>
            </div>
          </Card>

          <Card className="evaluation-history__stat-card">
            <div className="evaluation-history__stat">
              <div className="evaluation-history__stat-icon">👥</div>
              <div className="evaluation-history__stat-content">
                <h3>{stats.totalTeammates}</h3>
                <p>Teammates Evaluated</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="evaluation-history__filters">
        <div className="evaluation-history__filter-group">
          <label className="evaluation-history__filter-label">Show:</label>
          <div className="evaluation-history__filter-buttons">
            {[
              { key: 'all', label: 'All Evaluations' },
              { key: 'recent', label: 'Recent (7 days)' },
              { key: 'course', label: 'By Course' }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                className={`evaluation-history__filter-button ${
                  filter === filterOption.key ? 'active' : ''
                }`}
                onClick={() => {
                  setFilter(filterOption.key);
                  if (filterOption.key !== 'course') {
                    setSelectedCourse('');
                  }
                }}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {filter === 'course' && courses.length > 0 && (
          <div className="evaluation-history__course-select">
            <label className="evaluation-history__filter-label">Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="evaluation-history__select"
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
        )}
      </Card>

      {/* History List */}
      <div className="evaluation-history__content">
        {isLoading ? (
          <div className="evaluation-history__loading">
            <div className="evaluation-history__loading-spinner"></div>
            <p>Loading your evaluation history...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <Card className="evaluation-history__empty">
            <div className="evaluation-history__empty-content">
              <div className="evaluation-history__empty-icon">📝</div>
              <h3>
                {submissions.length === 0
                  ? 'No Evaluations Completed Yet'
                  : 'No Evaluations Found'
                }
              </h3>
              <p>
                {submissions.length === 0
                  ? 'Start completing peer evaluations to see your history here.'
                  : 'No evaluations match the current filter criteria.'
                }
              </p>
              {submissions.length === 0 && (
                <Link to="/student/evaluation/pending">
                  <Button variant="primary" className="mt-4">
                    View Pending Evaluations
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <div className="evaluation-history__list">
            {filteredSubmissions.map(submission => (
              <Card key={submission.id} className="evaluation-history__item" interactive>
                <div className="evaluation-history__item-header">
                  <div className="evaluation-history__item-main">
                    <h3 className="evaluation-history__item-title">{submission.formTitle}</h3>
                    <div className="evaluation-history__item-meta">
                      <span><strong>Course:</strong> {submission.course}</span>
                      <span><strong>Team ID:</strong> {submission.teamId}</span>
                      <span><strong>Teammates:</strong> {submission.metadata.totalTeammates}</span>
                      <span><strong>Submitted:</strong> {formatDate(submission.submittedAt)}</span>
                    </div>
                  </div>

                  <div className="evaluation-history__item-stats">
                    <div className="evaluation-history__stat-item">
                      <span className="evaluation-history__stat-value">
                        {submission.metadata.avgRating}/5
                      </span>
                      <span className="evaluation-history__stat-label">Avg Rating</span>
                    </div>
                    <div className="evaluation-history__time-ago">
                      {formatTimeAgo(submission.submittedAt)}
                    </div>
                  </div>
                </div>

                <div className="evaluation-history__item-details">
                  <div className="evaluation-history__teammates">
                    <strong>Evaluated Teammates:</strong>
                    <div className="evaluation-history__teammate-list">
                      {submission.teammates.slice(0, 3).map((teammate, index) => (
                        <span key={index} className="evaluation-history__teammate-tag">
                          {teammate}
                        </span>
                      ))}
                      {submission.teammates.length > 3 && (
                        <span className="evaluation-history__teammate-more">
                          +{submission.teammates.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="evaluation-history__item-actions">
                  <Button 
                    variant="ghost" 
                    size="small"
                    onClick={() => handleViewDetails(submission)}
                  >
                    View Details
                  </Button>
                  
                  <div className="evaluation-history__submission-time">
                    <small>Completion time: {submission.metadata.submissionTime}</small>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedSubmission && (
        <div className="evaluation-history__modal-overlay" onClick={closeDetails}>
          <div className="evaluation-history__modal" onClick={(e) => e.stopPropagation()}>
            <div className="evaluation-history__modal-header">
              <h3>Evaluation Details</h3>
              <button 
                className="evaluation-history__modal-close"
                onClick={closeDetails}
              >
                ✕
              </button>
            </div>
            
            <div className="evaluation-history__modal-content">
              <div className="evaluation-history__modal-info">
                <h4>{selectedSubmission.formTitle}</h4>
                <p><strong>Course:</strong> {selectedSubmission.course}</p>
                <p><strong>Team ID:</strong> {selectedSubmission.teamId}</p>
                <p><strong>Submitted:</strong> {formatDate(selectedSubmission.submittedAt)}</p>
                <p><strong>Completion Time:</strong> {selectedSubmission.metadata.submissionTime}</p>
              </div>

              <div className="evaluation-history__modal-evaluations">
                <h4>Evaluations Submitted:</h4>
                <div className="evaluation-history__evaluations-grid">
                  {selectedSubmission.evaluations.map((evaluation, index) => (
                    <Card key={index} className="evaluation-history__evaluation-card">
                      <h5>Evaluation for: {evaluation.teammateName}</h5>
                      <div className="evaluation-history__responses">
                        {Object.entries(evaluation.responses).map(([questionId, response]) => (
                          <div key={questionId} className="evaluation-history__response">
                            <strong>Q{questionId}:</strong> {
                              Array.isArray(response) ? response.join(', ') : response
                            }
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="evaluation-history__modal-actions">
              <Button variant="ghost" onClick={closeDetails}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EvaluationHistory;