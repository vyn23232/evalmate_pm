import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import formStore from '../../utils/FormStore';
import evaluationStore from '../../utils/EvaluationStore';
import './Sidebar.css';

function Sidebar({ onClose }) {
  const { user, logout, isStudent, isFaculty } = useAuth();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadSubmissions, setUnreadSubmissions] = useState(0);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Update counts based on user role
  useEffect(() => {
    const updateCounts = () => {
      if (isStudent) {
        // Count published forms for students
        const publishedForms = formStore.getPublishedForms();
        setPendingCount(publishedForms.length);
      } else if (isFaculty) {
        // Count unread submissions for faculty
        const stats = evaluationStore.getStats();
        setUnreadSubmissions(stats.unread);
      }
    };

    updateCounts();
    
    // Subscribe to store changes
    const unsubscribeForm = formStore.subscribe ? formStore.subscribe(updateCounts) : () => {};
    const unsubscribeEval = evaluationStore.subscribe ? evaluationStore.subscribe(updateCounts) : () => {};

    return () => {
      unsubscribeForm();
      unsubscribeEval();
    };
  }, [isStudent, isFaculty]);

  const studentNavItems = [
    {
      section: 'Dashboard',
      items: [
        {
          title: 'Overview',
          path: '/student/dashboard',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          )
        }
      ]
    },
    {
      section: 'Evaluations',
      items: [
        {
          title: 'Pending Evaluations',
          path: '/student/evaluation/pending',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          ),
          badge: pendingCount > 0 ? pendingCount.toString() : null
        },
        {
          title: 'History',
          path: '/student/evaluation/history',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
          )
        }
      ]
    },
    {
      section: 'Account',
      items: [
        {
          title: 'Profile',
          path: '/student/profile',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )
        }
      ]
    }
  ];

  const facultyNavItems = [
    {
      section: 'Dashboard',
      items: [
        {
          title: 'Overview',
          path: '/faculty/dashboard',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          )
        },
        {
          title: 'Analytics',
          path: '/faculty/analytics',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18"></path>
              <path d="M18 17V9"></path>
              <path d="M13 17V5"></path>
              <path d="M8 17v-3"></path>
            </svg>
          )
        }
      ]
    },
    {
      section: 'Management',
      items: [
        {
          title: 'Form Builder',
          path: '/faculty/forms',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          )
        },
        {
          title: 'Reports',
          path: '/faculty/reports',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
            </svg>
          ),
          badge: unreadSubmissions > 0 ? unreadSubmissions.toString() : null
        }
      ]
    }
  ];

  const navItems = isStudent ? studentNavItems : facultyNavItems;

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar__header">
        <Link to="/" className="sidebar__logo">
          <div className="sidebar__logo-icon">EM</div>
          <span>EvalMate</span>
        </Link>
        
        <button 
          className="sidebar__close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {navItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="sidebar__section">
            <h3 className="sidebar__section-title">{section.section}</h3>
            <ul className="sidebar__nav-list">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="sidebar__nav-item">
                  <Link
                    to={item.path}
                    className={`sidebar__nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <span className="sidebar__nav-icon">
                      {item.icon}
                    </span>
                    <span className="sidebar__nav-text">{item.title}</span>
                    {item.badge && (
                      <span className="sidebar__nav-badge">{item.badge}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16,17 21,12 16,7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;