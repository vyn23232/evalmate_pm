## US-02: Register (Sign Up) Feature

### Step 1: Define the Fields & Rules
- Name
  - Cannot be empty if required by UI.
- Email
  - Must be a valid email format.
  - Must be unique (duplicate prevention handled server-side or via store).
- Password
  - Cannot be empty.
  - May enforce minimum length/strength rules.
- Role
  - Select Student or Faculty (or assigned automatically by system rules).

### Step 2: Main User Story
- Story ID: US-02
- Title: User Registration

As a new user, I want to register an account so I can log in and use the platform.

### Step 3: Acceptance Criteria (Detailed Rules)
Positive Path
1. Valid inputs create a new user record and either auto-login or redirect to Login with success message.

Negative Path
1. Empty required fields → inline validation errors.
2. Invalid email format → show format error.
3. Duplicate email → show friendly error indicating email is taken.

### Subtasks

### Subtasks
• Design login form (UI).
• Create login API endpoint.
• Connect front-end to backend.
• Implement session handling.
• Test login with valid/invalid inputs.

### Project Approach Alignment
- I. Requirements: Confirm registration fields and role assignment rules with stakeholders; include privacy considerations.
- II. Design: Add registration screens to Figma and ensure DB schema supports user profiles in Supabase/MySQL.
- III. Development: Implement create-user endpoints in Flask and client-side validation in `src/pages/auth/Register.jsx`.
- IV. Testing: Unit tests for validation and integration tests for backend user creation.
- V. Deployment: Migrate user table schema and enable secure connections for registration APIs.
- VI. Review: Include registration flows in sprint demos and UAT sessions.
