import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import formStore from '../../utils/FormStore';
import './PendingEvaluations.css';

function PendingEvaluations() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Load evaluations from FormStore on component mount and when forms change
  useEffect(() => {
    const loadEvaluations = () => {
      setIsLoading(true);
      try {
        const publishedForms = formStore.getPublishedForms();
        const formattedEvaluations = publishedForms.map(form => 
          formStore.convertForStudentDisplay(form)
        );
        setEvaluations(formattedEvaluations);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error loading evaluations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvaluations();
    
    // Set up a simple polling mechanism to check for new forms
    // In a real app, this would be replaced with WebSocket or server-sent events
    const interval = setInterval(loadEvaluations, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const refreshEvaluations = () => {
    const publishedForms = formStore.getPublishedForms();
    const formattedEvaluations = publishedForms.map(form => 
      formStore.convertForStudentDisplay(form)
    );
    setEvaluations(formattedEvaluations);
    setLastUpdate(new Date());
  };





  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due in 1 day';
    return `Due in ${diffDays} days`;
  };

  const getStatusColor = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'var(--danger-color)'; // Overdue
    if (diffDays <= 1) return 'var(--warning-color)'; // Due today or tomorrow
    if (diffDays <= 3) return 'var(--primary-color)'; // Due soon
    return 'var(--text-muted)'; // Future deadlines
  };

  const filteredEvaluations = evaluations
    .filter(evaluation => {
      if (filter === 'all') return true;
      if (filter === 'urgent') {
        const now = new Date();
        const due = new Date(evaluation.dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3; // Show urgent if due in 3 days or less
      }
      if (filter === 'started') return evaluation.progress > 0;
      if (filter === 'not-started') return evaluation.progress === 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

  return (
    <div className="pending-evaluations">
      <div className="pending-evaluations__header">
        <div className="pending-evaluations__title-section">
          <h1 className="pending-evaluations__title">Pending Evaluations</h1>
          <p className="pending-evaluations__subtitle">
            Complete your peer evaluations to help improve team collaboration
          </p>
        </div>
        
        <div className="pending-evaluations__stats">
          <div className="pending-evaluations__stat">
            <span className="pending-evaluations__stat-number">{evaluations.length}</span>
            <span className="pending-evaluations__stat-label">Total Pending</span>
          </div>
          <div className="pending-evaluations__stat">
            <span className="pending-evaluations__stat-number">
              {evaluations.filter(e => {
                const now = new Date();
                const due = new Date(e.dueDate);
                const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays <= 1; // Due today or overdue
              }).length}
            </span>
            <span className="pending-evaluations__stat-label">Due Today</span>
          </div>
          <div className="pending-evaluations__refresh-section">
            <Button 
              variant="ghost" 
              size="small" 
              onClick={refreshEvaluations}
              disabled={isLoading}
            >
              {isLoading ? '🔄 Checking...' : '🔄 Refresh'}
            </Button>
            <div className="pending-evaluations__last-update">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <Card className="pending-evaluations__controls">
        <div className="pending-evaluations__filters">
          <div className="pending-evaluations__filter-group">
            <label className="pending-evaluations__filter-label">Filter by:</label>
            <div className="pending-evaluations__filter-buttons">
              {[
                { key: 'all', label: 'All' },
                { key: 'urgent', label: 'Urgent' },
                { key: 'started', label: 'In Progress' },
                { key: 'not-started', label: 'Not Started' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  className={`pending-evaluations__filter-button ${
                    filter === filterOption.key ? 'active' : ''
                  }`}
                  onClick={() => setFilter(filterOption.key)}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pending-evaluations__sort-group">
            <label className="pending-evaluations__sort-label">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pending-evaluations__sort-select"
            >
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Evaluations List */}
      <div className="pending-evaluations__list">
        {filteredEvaluations.length === 0 ? (
          <Card className="pending-evaluations__empty">
            <div className="pending-evaluations__empty-content">
              <svg className="pending-evaluations__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
              </svg>
              <h3>No evaluations found</h3>
              <p>You're all caught up! No evaluations match the current filter.</p>
            </div>
          </Card>
        ) : (
          filteredEvaluations.map(evaluation => (
            <Card key={evaluation.id} className="pending-evaluations__item" interactive>
              <div className="pending-evaluations__item-header">
                <div className="pending-evaluations__item-main">
                  <div className="pending-evaluations__item-title-section">
                    <h3 className="pending-evaluations__item-title">{evaluation.title}</h3>
                    <div className="pending-evaluations__item-badges">
                      {evaluation.isAnonymous && (
                        <span className="pending-evaluations__badge pending-evaluations__badge--anonymous">
                          🔒 Anonymous
                        </span>
                      )}
                      {evaluation.type === 'master' && (
                        <span className="pending-evaluations__badge pending-evaluations__badge--flexible">
                          ✨ Flexible Teams
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="pending-evaluations__item-details">
                    <div className="pending-evaluations__item-meta">
                      <span><strong>Course:</strong> {evaluation.course}</span>
                      <span><strong>Created by:</strong> {evaluation.createdBy}</span>
                      <span><strong>Team Size:</strong> {evaluation.minTeamSize}-{evaluation.maxTeamSize} members</span>
                      <span><strong>Estimated Time:</strong> {evaluation.estimatedTime}</span>
                    </div>
                    
                    <div className="pending-evaluations__master-preview">
                      <div className="pending-evaluations__master-info">
                        <p><strong>Instructions:</strong> {evaluation.instructions}</p>
                        <div className="pending-evaluations__sections">
                          <strong>Evaluation Sections:</strong>
                          <div className="pending-evaluations__section-tags">
                            {evaluation.sections.map((section, index) => (
                              <span key={index} className="pending-evaluations__section-tag">
                                {section}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pending-evaluations__item-status">
                  <div 
                    className="pending-evaluations__due-date"
                    style={{ color: getStatusColor(evaluation.dueDate) }}
                  >
                    <svg className="pending-evaluations__clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    {getDaysUntilDue(evaluation.dueDate)}
                  </div>
                  
                  {evaluation.progress > 0 && (
                    <div className="pending-evaluations__progress">
                      <div className="pending-evaluations__progress-bar">
                        <div 
                          className="pending-evaluations__progress-fill"
                          style={{ width: `${evaluation.progress}%` }}
                        />
                      </div>
                      <span className="pending-evaluations__progress-text">{evaluation.progress}% complete</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pending-evaluations__item-actions">
                <Link to={`/student/evaluation/flexible/${evaluation.id}`}>
                  <Button 
                    variant="primary"
                    size="small"
                  >
                    🚀 Start Flexible Evaluation
                  </Button>
                </Link>
                
                <Button variant="ghost" size="small">
                  View Details
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {filteredEvaluations.length > 0 && (
        <Card className="pending-evaluations__quick-actions">
          <div className="pending-evaluations__actions-header">
            <h3>Quick Actions</h3>
            <p>Batch operations for your evaluations</p>
          </div>
          
          <div className="pending-evaluations__actions-buttons">
            <Button variant="secondary" size="small">
              Mark All as Reviewed
            </Button>
            <Button variant="ghost" size="small">
              Export List
            </Button>
            <Button variant="ghost" size="small">
              Set Reminders
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default PendingEvaluations;