// Utility to clear authentication data and reset the app to initial state
import userStore from '../utils/UserStore.js';

export const clearAuthData = () => {
  // Clear localStorage
  localStorage.removeItem('evalmate_user');
  
  // Reset UserStore to initial state (keeps demo accounts)
  userStore.reset();
  
  console.log('Authentication data cleared. App reset to initial state.');
};

export const forceLogout = () => {
  // Clear localStorage
  localStorage.removeItem('evalmate_user');
  
  // Reload the page to ensure clean state
  window.location.href = '/login';
};

// Development utility to check current auth state
export const debugAuthState = () => {
  const savedUser = localStorage.getItem('evalmate_user');
  const stats = userStore.getRegistrationStats();
  
  console.log('=== Current Auth State ===');
  console.log('localStorage user:', savedUser ? JSON.parse(savedUser) : 'None');
  console.log('UserStore stats:', stats);
  console.log('Available users:', userStore.getAllUsers().map(u => ({ email: u.email, userType: u.userType })));
};

export default {
  clearAuthData,
  forceLogout,
  debugAuthState
};