import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import FlexibleEvaluationForm from './pages/student/FlexibleEvaluationForm';
import PendingEvaluations from './pages/student/PendingEvaluations';
import EvaluationHistory from './pages/student/EvaluationHistory';
import StudentProfile from './pages/student/StudentProfile';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FormBuilder from './pages/faculty/FormBuilder';
import Reports from './pages/faculty/Reports';
import Analytics from './pages/faculty/Analytics';

// Styles
import './styles/globals.css';

// Smart redirect component that redirects based on user role
function SmartRedirect() {
  const { user, isFaculty, isStudent } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (isFaculty) {
    return <Navigate to="/faculty/dashboard" replace />;
  }
  
  if (isStudent) {
    return <Navigate to="/student/dashboard" replace />;
  }
  
  // Fallback to student dashboard
  return <Navigate to="/student/dashboard" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Layout />}>
              {/* Smart redirect based on user role */}
              <Route index element={<SmartRedirect />} />
              
              {/* Student Routes */}
              <Route path="student">
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="evaluation/pending" element={<PendingEvaluations />} />
                <Route path="evaluation/history" element={<EvaluationHistory />} />
                <Route path="evaluation/flexible/:formId" element={<FlexibleEvaluationForm />} />
                <Route path="profile" element={<StudentProfile />} />
              </Route>
              
              {/* Faculty Routes */}
              <Route path="faculty">
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="forms" element={<FormBuilder />} />
                <Route path="reports" element={<Reports />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
