import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import evaluationStore from '../../utils/EvaluationStore';
import formStore from '../../utils/FormStore';
import './NotificationDropdown.css';

function NotificationDropdown({ isOpen, onClose, onToggle }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = () => {
      if (user?.userType === 'faculty') {
        // Faculty sees new student submissions
        const recentSubmissions = evaluationStore.getRecentSubmissions(10);
        const submissionNotifications = recentSubmissions.map(submission => ({
          id: submission.id,
          type: 'submission',
          title: 'New Evaluation Submitted',
          message: `${submission.studentName} submitted evaluation for "${submission.formTitle}"`,
          timestamp: submission.submittedAt,
          isRead: submission.isRead,
          data: submission
        }));

        setNotifications(submissionNotifications);
        setUnreadCount(evaluationStore.getUnreadCount());
      } else {
        // Students see new published forms
        const publishedForms = formStore.getPublishedForms();
        const recentForms = publishedForms
          .filter(form => {
            const publishedDate = new Date(form.publishedAt || form.createdAt);
            const daysSince = (new Date() - publishedDate) / (1000 * 60 * 60 * 24);
            return daysSince <= 7; // Show forms published in last 7 days
          })
          .slice(0, 10);

        const formNotifications = recentForms.map(form => ({
          id: form.id,
          type: 'form',
          title: 'New Evaluation Available',
          message: `${form.course} - "${form.title}" is now available for completion`,
          timestamp: form.publishedAt || form.createdAt,
          isRead: true, // For demo purposes, assume student notifications are read when viewed
          data: form
        }));

        setNotifications(formNotifications);
        setUnreadCount(0); // Students don't have unread count for demo
      }
    };

    loadNotifications();

    // Subscribe to store updates
    const unsubscribeEval = evaluationStore.subscribe(loadNotifications);
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);

    return () => {
      unsubscribeEval();
      clearInterval(interval);
    };
  }, [user]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (user?.userType === 'faculty' && notification.type === 'submission') {
      evaluationStore.markAsRead(notification.id);
      setUnreadCount(evaluationStore.getUnreadCount());
      // Could navigate to reports or show detail view
      window.location.href = '/faculty/reports';
    } else if (notification.type === 'form') {
      // Navigate to evaluation form
      window.location.href = `/student/evaluation/flexible/${notification.data.id}`;
    }
    onClose();
  };

  const markAllAsRead = () => {
    if (user?.userType === 'faculty') {
      evaluationStore.markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown__header">
        <h3>Notifications</h3>
        {user?.userType === 'faculty' && unreadCount > 0 && (
          <button 
            className="notification-dropdown__mark-read"
            onClick={markAllAsRead}
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="notification-dropdown__content">
        {notifications.length === 0 ? (
          <div className="notification-dropdown__empty">
            <div className="notification-dropdown__empty-icon">🔔</div>
            <h4>No notifications</h4>
            <p>
              {user?.userType === 'faculty' 
                ? 'New evaluation submissions will appear here'
                : 'New evaluation forms will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="notification-dropdown__list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-dropdown__item ${
                  !notification.isRead ? 'notification-dropdown__item--unread' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-dropdown__item-icon">
                  {notification.type === 'submission' ? '📝' : '📋'}
                </div>
                <div className="notification-dropdown__item-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-dropdown__item-time">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
                {!notification.isRead && (
                  <div className="notification-dropdown__item-unread-dot"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notification-dropdown__footer">
          <button 
            className="notification-dropdown__view-all"
            onClick={() => {
              const path = user?.userType === 'faculty' ? '/faculty/reports' : '/student/evaluations';
              window.location.href = path;
            }}
          >
            {user?.userType === 'faculty' ? 'View All Reports' : 'View All Evaluations'}
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;