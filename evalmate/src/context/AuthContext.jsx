import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock registration function - simple demo functionality
  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple validation - check if email already exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('evalmate_registered_users') || '[]');
      const emailExists = existingUsers.some(user => user.email === userData.email);
      
      if (emailExists) {
        return { success: false, error: 'Email already registered' };
      }
      
      // Create user object
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        userType: userData.userType,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`,
        institution: userData.institution,
        department: userData.department,
        studentId: userData.studentId,
        employeeId: userData.employeeId,
        phone: userData.phone,
        avatar: null,
        createdAt: new Date().toISOString()
      };
      
      // Store user in localStorage registry
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('evalmate_registered_users', JSON.stringify(updatedUsers));
      
      // Auto-login the new user
      setUser(newUser);
      localStorage.setItem('evalmate_user', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Mock login function - replace with actual authentication logic later
  const login = async (email, password, userType = 'student') => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user is registered
      const registeredUsers = JSON.parse(localStorage.getItem('evalmate_registered_users') || '[]');
      const registeredUser = registeredUsers.find(user => user.email === email && user.userType === userType);
      
      if (!registeredUser) {
        return { success: false, error: 'Invalid credentials. Please register first.' };
      }
      
      const userData = registeredUser;
      
      setUser(userData);
      localStorage.setItem('evalmate_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('evalmate_user');
  };

  // Check for existing session on app load
  React.useEffect(() => {
    const savedUser = localStorage.getItem('evalmate_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('evalmate_user');
      }
    }
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isStudent: user?.userType === 'student',
    isFaculty: user?.userType === 'faculty'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}