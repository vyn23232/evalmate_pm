import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import evaluationStore from '../../utils/EvaluationStore';
import formStore from '../../utils/FormStore';
import './Reports.css';

function Reports() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load submissions and stats
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        const allSubmissions = evaluationStore.getAllSubmissions();
        const submissionStats = evaluationStore.getStats();
        setSubmissions(allSubmissions);
        setStats(submissionStats);
      } catch (error) {
        console.error('Error loading submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const unsubscribe = evaluationStore.subscribe(loadData);
    
    // Refresh every 30 seconds to catch any new submissions
    const interval = setInterval(loadData, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Filter and sort submissions
  const filteredSubmissions = submissions
    .filter(submission => {
      if (filter === 'all') return true;
      if (filter === 'today') {
        const today = new Date().toDateString();
        return new Date(submission.submittedAt).toDateString() === today;
      }
      if (filter === 'unread') return !submission.isRead;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      }
      if (sortBy === 'rating') {
        return b.metadata.avgRating - a.metadata.avgRating;
      }
      if (sortBy === 'course') {
        return a.course.localeCompare(b.course);
      }
      return 0;
    });

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    evaluationStore.markAsRead(submission.id);
    // Reload to update unread count
    setStats(evaluationStore.getStats());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'var(--color-success)';
    if (rating >= 3.5) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  if (selectedSubmission) {
    return (
      <div className="reports">
        <div className="reports__header">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedSubmission(null)}
            className="reports__back-button"
          >
            ← Back to Reports
          </Button>
          <h1>Evaluation Details</h1>
        </div>

        <div className="reports__detail-view">
          <Card className="reports__detail-card">
            <div className="reports__detail-header">
              <div className="reports__detail-info">
                <h2>{selectedSubmission.formTitle}</h2>
                <p className="reports__detail-meta">
                  <strong>Course:</strong> {selectedSubmission.course} • 
                  <strong> Student:</strong> {selectedSubmission.studentName} • 
                  <strong> Team:</strong> {selectedSubmission.teamId} • 
                  <strong> Submitted:</strong> {formatDate(selectedSubmission.submittedAt)}
                </p>
              </div>
              <div className="reports__detail-stats">
                <div className="reports__stat-item">
                  <span className="reports__stat-label">Average Rating</span>
                  <span 
                    className="reports__stat-value" 
                    style={{ color: getRatingColor(selectedSubmission.metadata.avgRating) }}
                  >
                    {selectedSubmission.metadata.avgRating}/5
                  </span>
                </div>
                <div className="reports__stat-item">
                  <span className="reports__stat-label">Teammates Evaluated</span>
                  <span className="reports__stat-value">{selectedSubmission.teammates.length}</span>
                </div>
              </div>
            </div>

            <div className="reports__evaluations-grid">
              {selectedSubmission.evaluations.map((evaluation, index) => (
                <Card key={index} className="reports__evaluation-card">
                  <h4>Evaluation for: {evaluation.teammateName}</h4>
                  <div className="reports__responses">
                    {Object.entries(evaluation.responses).map(([questionId, response]) => (
                      <div key={questionId} className="reports__response-item">
                        <span className="reports__question-id">Question {questionId}:</span>
                        <span 
                          className="reports__response-value"
                          style={{ 
                            color: getRatingColor(response),
                            fontWeight: '600'
                          }}
                        >
                          {response}/5
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="reports">
      <div className="reports__header">
        <h1>Evaluation Reports</h1>
        <p>View and analyze submitted peer evaluations from students</p>
      </div>

      {/* Statistics Overview */}
      <div className="reports__stats-grid">
        <Card className="reports__stat-card">
          <div className="reports__stat-content">
            <h3>{stats.total || 0}</h3>
            <p>Total Submissions</p>
          </div>
          <div className="reports__stat-icon">📊</div>
        </Card>
        <Card className="reports__stat-card">
          <div className="reports__stat-content">
            <h3>{stats.todaySubmissions || 0}</h3>
            <p>Today's Submissions</p>
          </div>
          <div className="reports__stat-icon">📅</div>
        </Card>
        <Card className="reports__stat-card">
          <div className="reports__stat-content">
            <h3>{stats.unread || 0}</h3>
            <p>Unread Submissions</p>
          </div>
          <div className="reports__stat-icon">🔔</div>
        </Card>
        <Card className="reports__stat-card">
          <div className="reports__stat-content">
            <h3>{stats.averageRating || 0}/5</h3>
            <p>Average Rating</p>
          </div>
          <div className="reports__stat-icon">⭐</div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="reports__controls">
        <div className="reports__controls-section">
          <div className="reports__filters">
            <label>Filter:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="reports__select"
            >
              <option value="all">All Submissions</option>
              <option value="today">Today's Submissions</option>
              <option value="unread">Unread Only</option>
            </select>

            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="reports__select"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rating</option>
              <option value="course">Course</option>
            </select>
          </div>

          <div className="reports__actions">
            <Button 
              variant="ghost" 
              size="small"
              onClick={() => {
                evaluationStore.markAllAsRead();
                setStats(evaluationStore.getStats());
              }}
            >
              Mark All Read
            </Button>
            <Button variant="secondary" size="small">
              Export Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Submissions List - Grouped by Team */}
      <Card className="reports__submissions">
        <div className="reports__submissions-header">
          <h3>Recent Submissions ({filteredSubmissions.length})</h3>
        </div>

        {isLoading ? (
          <div className="reports__loading">Loading submissions...</div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="reports__empty-state">
            <div className="reports__empty-icon">📝</div>
            <h3>No submissions yet</h3>
            <p>Submitted evaluations will appear here once students complete their peer evaluations.</p>
          </div>
        ) : (
          <div className="reports__submissions-list">
            {/* Group submissions by teamId */}
            {Object.entries(
              filteredSubmissions.reduce((groups, sub) => {
                const team = sub.teamId || 'No Team';
                if (!groups[team]) groups[team] = [];
                groups[team].push(sub);
                return groups;
              }, {})
            ).map(([teamId, teamSubs]) => (
              <div key={teamId} className="reports__team-group">
                <h4 className="reports__team-heading">Team: {teamId}</h4>
                {teamSubs.map((submission) => (
                  <div 
                    key={submission.id} 
                    className={`reports__submission-item ${!submission.isRead ? 'reports__submission-item--unread' : ''}`}
                    onClick={() => handleViewSubmission(submission)}
                  >
                    <div className="reports__submission-info">
                      <div className="reports__submission-header">
                        <h4>{submission.formTitle}</h4>
                        {!submission.isRead && <span className="reports__unread-badge">New</span>}
                      </div>
                      <p className="reports__submission-meta">
                        <strong>{submission.studentName}</strong> • {submission.course}
                      </p>
                      <div className="reports__submission-details">
                        <span>📅 {formatDate(submission.submittedAt)}</span>
                        <span>👥 {submission.teammates.length} teammates</span>
                        <span 
                          style={{ color: getRatingColor(submission.metadata.avgRating) }}
                        >
                          ⭐ {submission.metadata.avgRating}/5
                        </span>
                      </div>
                    </div>
                    <div className="reports__submission-actions">
                      <Button variant="ghost" size="small">
                        View Details →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Reports;