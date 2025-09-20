import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import formStore from '../../utils/FormStore';
import evaluationStore from '../../utils/EvaluationStore';
import './StudentDashboard.css';

function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const loadDashboardData = () => {
      setIsLoading(true);
      try {
        // Get published forms for student
        const publishedForms = formStore.getPublishedForms();
        
        // Get student's submissions
        const mySubmissions = evaluationStore.getSubmissionsByStudent(user?.email || user?.id);
        
        // Calculate statistics
        const pendingCount = publishedForms.length;
        const completedCount = mySubmissions.length;
        const totalPossible = pendingCount + completedCount;
        const completionRate = totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0;

        // Set stats
        setStats([
          {
            icon: '📝',
            value: pendingCount,
            label: 'Pending Evaluations'
          },
          {
            icon: '✅',
            value: completedCount,
            label: 'Completed Evaluations'
          },
          {
            icon: '📊',
            value: `${completionRate}%`,
            label: 'Completion Rate'
          }
        ]);



        // Set upcoming deadlines
        const urgentForms = publishedForms.filter(form => {
          const dueDate = new Date(form.dueDate);
          const now = new Date();
          const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
          return daysLeft <= 7 && daysLeft >= 0;
        });

        setUpcomingDeadlines(urgentForms.map(form => ({
          title: form.title,
          date: new Date(form.dueDate).toLocaleDateString(),
          urgency: getDaysUntilDue(form.dueDate) <= 2 ? 'high' : 'medium',
          course: form.course
        })));



      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Subscribe to updates
    const unsubscribeForm = formStore.subscribe ? formStore.subscribe(loadDashboardData) : () => {};
    const unsubscribeEval = evaluationStore.subscribe ? evaluationStore.subscribe(loadDashboardData) : () => {};

    return () => {
      unsubscribeForm();
      unsubscribeEval();
    };
  }, [user]);

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="student-dashboard">
      {/* Enhanced Header */}
      <div className="student-dashboard__header">
        <div className="student-dashboard__header-content">
          <h1 className="student-dashboard__greeting">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="student-dashboard__subtitle">
            Ready to continue your evaluation journey? Here's your personalized overview.
          </p>
          <p className="student-dashboard__date">{getCurrentDate()}</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading your dashboard...</span>
        </div>
      ) : (
        <>

      {/* Enhanced Statistics */}
      <div className="student-dashboard__stats">
        {stats.map((stat, index) => (
          <div key={index} className={`student-dashboard__stat-card student-dashboard__stat-card--${index === 0 ? 'primary' : index === 1 ? 'success' : index === 2 ? 'info' : 'warning'}`}>
            <div className="student-dashboard__stat-icon">
              {stat.icon}
            </div>
            <div className="student-dashboard__stat-content">
              <h3 className="student-dashboard__stat-number">{stat.value}</h3>
              <p className="student-dashboard__stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Deadlines */}
      <div className="student-dashboard__section student-dashboard__section--full-width">
        <div className="student-dashboard__section-header">
          <h2 className="student-dashboard__section-title">Upcoming Deadlines</h2>
          <p className="student-dashboard__section-subtitle">Don't miss these important evaluation deadlines</p>
        </div>
        <div className="student-dashboard__deadlines-list">
          {upcomingDeadlines.length === 0 ? (
            <div className="student-dashboard__empty-state">
              <h3>📅 No Upcoming Deadlines</h3>
              <p>You're all caught up! No pending evaluation deadlines at the moment.</p>
            </div>
          ) : (
            upcomingDeadlines.map((deadline, index) => (
              <div key={index} className={`student-dashboard__deadline-item student-dashboard__deadline-item--${deadline.urgency}`}>
                <div className="student-dashboard__deadline-content">
                  <h3 className="student-dashboard__deadline-title">{deadline.title}</h3>
                  <span className="student-dashboard__deadline-date">{deadline.date}</span>
                </div>
                <div className="student-dashboard__deadline-indicator"></div>
              </div>
            ))
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}

export default StudentDashboard;