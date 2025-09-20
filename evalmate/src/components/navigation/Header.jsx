import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import evaluationStore from '../../utils/EvaluationStore';
import './Header.css';

function Header({ onMenuClick }) {
  const { user } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Update unread count for faculty users
  useEffect(() => {
    if (user?.userType === 'faculty') {
      const updateUnreadCount = () => {
        setUnreadCount(evaluationStore.getUnreadCount());
      };

      updateUnreadCount();
      const unsubscribe = evaluationStore.subscribe(updateUnreadCount);
      
      return unsubscribe;
    }
  }, [user]);

  // Handle clicks outside notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <div className="header">
      <div className="header__left">
        {/* Mobile menu button */}
        <button 
          className="header__menu-button"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="header__logo">
          <div className="header__logo-icon">EM</div>
          <span>EvalMate</span>
        </Link>
      </div>

      <div className="header__right">
        {/* Search */}
        <div className="header__search">
          <svg 
            className="header__search-icon" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="header__search-input"
            placeholder="Search evaluations..."
          />
        </div>

        {/* Notifications */}
        <div className="header__notifications-container" ref={notificationRef}>
          <button 
            className={`header__notifications ${isNotificationOpen ? 'header__notifications--active' : ''}`}
            aria-label="Notifications"
            onClick={toggleNotifications}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadCount > 0 && (
              <span className="header__notification-badge">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown 
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            onToggle={toggleNotifications}
          />
        </div>

        {/* User menu */}
        <div className="header__user-menu">
          <button className="header__user-button">
            <div className="header__user-avatar">
              {user?.name ? getInitials(user.name) : 'U'}
            </div>
            <div className="header__user-info">
              <p className="header__user-name">{user?.name || 'User'}</p>
              <p className="header__user-role">{user?.userType || 'student'}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;