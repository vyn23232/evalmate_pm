import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../navigation/Header';
import Sidebar from '../navigation/Sidebar';
import './Layout.css';

function Layout() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add fixed layout class to body when Layout component mounts
  useEffect(() => {
    document.body.classList.add('fixed-layout');
    
    // Clean up: remove the class when component unmounts
    return () => {
      document.body.classList.remove('fixed-layout');
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="layout">
      {/* Mobile overlay */}
      <div 
        className={`layout__overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />
      
      {/* Sidebar */}
      <aside className={`layout__sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar onClose={closeSidebar} />
      </aside>

      {/* Main content area */}
      <div className="layout__main">
        <header className="layout__header">
          <Header onMenuClick={toggleSidebar} />
        </header>
        
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;