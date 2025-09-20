# EvalMate Registration System

## Overview
The EvalMate registration system provides a comprehensive user registration and authentication solution using a singleton pattern for demonstration purposes. This system supports both student and faculty registration with proper validation and data management.

## Features

### ✅ **Complete Registration Flow**
- **User Type Selection**: Students and Faculty registration options
- **Comprehensive Form**: Personal information, institution details, and credentials
- **Real-time Validation**: Client-side form validation with error feedback
- **Demo Registration**: Quick registration buttons for testing

### ✅ **Singleton User Store**
- **In-Memory Storage**: User data managed through singleton pattern
- **Data Persistence**: Session management with localStorage integration
- **User Management**: CRUD operations for user accounts
- **Security Features**: Email uniqueness, password validation

### ✅ **Authentication Integration**
- **Enhanced AuthContext**: Updated to support registration flow
- **Auto-Login**: Automatic login after successful registration
- **Session Management**: Persistent sessions across browser refreshes
- **Role-Based Access**: Student/Faculty role management

## File Structure

```
src/
├── pages/auth/
│   ├── Register.jsx          # Registration page component
│   ├── Register.css          # Registration page styling
│   └── Login.jsx             # Updated with registration link
├── utils/
│   ├── UserStore.js          # Singleton user data store
│   └── testUserStore.js      # Test file for UserStore
├── context/
│   └── AuthContext.jsx       # Updated authentication context
└── App.jsx                   # Updated with registration route
```

## User Registration Fields

### **Personal Information**
- First Name (required)
- Last Name (required)
- Email Address (required, must be unique)
- Phone Number (optional)

### **Security**
- Password (required, min 6 chars, must include uppercase, lowercase, number)
- Confirm Password (required, must match)

### **Institutional Details**
- Institution/University (required)
- Department (required)
- Student ID (required for students)
- Employee ID (required for faculty)

### **User Type**
- Student (default)
- Faculty

## Validation Rules

### **Email Validation**
```javascript
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### **Password Requirements**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- Must match confirmation

### **Required Fields**
- All personal information fields
- Institution and department
- User type specific ID (Student ID or Employee ID)

## API Documentation

### **UserStore Methods**

#### `register(userData)`
Registers a new user account.
```javascript
const result = userStore.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'Password123!',
  userType: 'student',
  institution: 'Demo University',
  department: 'Computer Science',
  studentId: 'STU-001'
});
```

#### `login(email, password, userType)`
Authenticates user login.
```javascript
const result = userStore.login('john@example.com', 'Password123!', 'student');
```

#### `isEmailRegistered(email)`
Checks if email is already registered.
```javascript
const exists = userStore.isEmailRegistered('john@example.com');
```

#### `getRegistrationStats()`
Returns user registration statistics.
```javascript
const stats = userStore.getRegistrationStats();
// Returns: { totalUsers, students, faculty, activeUsers, inactiveUsers }
```

## Usage Examples

### **Basic Registration**
```jsx
import { useAuth } from '../../context/AuthContext';

function RegisterForm() {
  const { register } = useAuth();
  
  const handleSubmit = async (formData) => {
    const result = await register(formData);
    if (result.success) {
      // User registered and logged in automatically
    } else {
      // Handle registration error
      console.error(result.error);
    }
  };
}
```

### **Check Email Availability**
```jsx
import { useAuth } from '../../context/AuthContext';

function EmailField() {
  const { isEmailRegistered } = useAuth();
  
  const checkEmail = (email) => {
    if (isEmailRegistered(email)) {
      setError('Email already registered');
    }
  };
}
```

## Demo Accounts

### **Pre-loaded Demo Users**
1. **Student Demo**
   - Email: `student@demo.com`
   - Password: `demo123`
   - Type: Student

2. **Faculty Demo**
   - Email: `faculty@demo.com`
   - Password: `demo123`
   - Type: Faculty

### **Quick Demo Registration**
The registration page includes "Register as Student" and "Register as Faculty" buttons that create demo accounts with pre-filled data.

## Navigation Flow

```
Registration Page (/register)
├── Fill Form → Validate → Register → Auto-Login → Dashboard
├── Demo Registration → Auto-Login → Dashboard  
└── "Sign in here" → Login Page (/login)

Login Page (/login)
├── Login Form → Authenticate → Dashboard
├── Demo Login → Dashboard
└── "Create one here" → Registration Page (/register)
```

## Security Considerations

### **Current Implementation (Demo)**
- Passwords stored in plain text (for demonstration)
- In-memory data storage
- Basic validation rules
- Client-side validation only

### **Production Recommendations**
- Hash passwords with bcrypt or similar
- Use secure backend database
- Implement server-side validation
- Add rate limiting for registration attempts
- Email verification workflow
- Admin approval for faculty accounts
- CSRF protection
- Input sanitization

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Supports localStorage for session persistence
- Accessible keyboard navigation
- Screen reader compatible

## Testing

Run the UserStore tests:
```javascript
// Import and run test file
import './utils/testUserStore.js';
```

Test coverage includes:
- Singleton pattern verification
- User registration validation
- Login authentication
- Email uniqueness checks
- Password validation
- Data export/import functionality

## Future Enhancements

### **Planned Features**
- Email verification workflow
- Password reset functionality  
- Social login integration
- Admin user management panel
- Bulk user import/export
- Advanced security features

### **Backend Integration**
- RESTful API endpoints
- Database schema design
- JWT token authentication
- Session management
- Role-based permissions

## Troubleshooting

### **Common Issues**

1. **Registration fails silently**
   - Check browser console for errors
   - Verify all required fields are filled
   - Ensure email format is valid

2. **Login after registration doesn't work**
   - Clear browser localStorage
   - Check if user was actually created in store
   - Verify password meets requirements

3. **Demo accounts not working**
   - UserStore may need reset: `userStore.reset()`
   - Check if demo data was properly initialized

4. **Form validation errors**
   - Ensure all required CSS classes are applied
   - Check if validation functions are properly bound
   - Verify error state management

## Support

For issues or questions about the registration system:
1. Check the browser console for error messages
2. Verify form data meets validation requirements  
3. Test with demo registration first
4. Review UserStore test file for expected behavior