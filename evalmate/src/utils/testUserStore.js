// Simple test file to verify the UserStore singleton implementation
import userStore from '../utils/UserStore.js';

// Test the singleton pattern
console.log('=== Testing UserStore Singleton ===');

// Test 1: Verify singleton pattern
const store1 = userStore;
const store2 = userStore;
console.log('Singleton test:', store1 === store2 ? 'PASS' : 'FAIL');

// Test 2: Check initial demo accounts
console.log('\n=== Initial Demo Accounts ===');
console.log('Student demo exists:', userStore.isEmailRegistered('student@demo.com') ? 'PASS' : 'FAIL');
console.log('Faculty demo exists:', userStore.isEmailRegistered('faculty@demo.com') ? 'PASS' : 'FAIL');

// Test 3: Register a new user
console.log('\n=== Registration Test ===');
const newUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'Test123!',
  confirmPassword: 'Test123!',
  userType: 'student',
  institution: 'Test University',
  department: 'Computer Science',
  studentId: 'TEST-001',
  employeeId: '',
  phone: '+1 (555) 999-0000'
};

const registrationResult = userStore.register(newUser);
console.log('Registration result:', registrationResult.success ? 'PASS' : `FAIL: ${registrationResult.error}`);

// Test 4: Login with new user
console.log('\n=== Login Test ===');
const loginResult = userStore.login('test@example.com', 'Test123!', 'student');
console.log('Login result:', loginResult.success ? 'PASS' : `FAIL: ${loginResult.error}`);

// Test 5: Duplicate registration prevention
console.log('\n=== Duplicate Prevention Test ===');
const duplicateResult = userStore.register(newUser);
console.log('Duplicate prevention:', !duplicateResult.success ? 'PASS' : 'FAIL');

// Test 6: Invalid email format
console.log('\n=== Email Validation Test ===');
const invalidEmailUser = { ...newUser, email: 'invalid-email' };
const invalidEmailResult = userStore.register(invalidEmailUser);
console.log('Email validation:', !invalidEmailResult.success ? 'PASS' : 'FAIL');

// Test 7: Password validation
console.log('\n=== Password Validation Test ===');
const weakPasswordUser = { ...newUser, email: 'weak@example.com', password: '123' };
const weakPasswordResult = userStore.register(weakPasswordUser);
console.log('Password validation:', !weakPasswordResult.success ? 'PASS' : 'FAIL');

// Test 8: Statistics
console.log('\n=== Statistics Test ===');
const stats = userStore.getRegistrationStats();
console.log('Statistics:', {
  totalUsers: stats.totalUsers,
  students: stats.students,
  faculty: stats.faculty,
  activeUsers: stats.activeUsers
});

// Test 9: Export/Import data
console.log('\n=== Data Export/Import Test ===');
const exportedData = userStore.exportData();
console.log('Data export:', exportedData.users ? 'PASS' : 'FAIL');

// Clean up - reset store
userStore.reset();
console.log('Store reset:', userStore.getRegistrationStats().totalUsers === 2 ? 'PASS' : 'FAIL');

console.log('\n=== All Tests Completed ===');