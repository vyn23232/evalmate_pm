## US-03: Role-based Dashboard (Student / Faculty)

### Step 1: Define the Fields & Rules
- Role detection
  - Derived from authenticated user profile in `AuthContext`.
- Dashboard content
  - Student: pending evaluations, history, profile.
  - Faculty: form builder, forms management, reports, group management.

### Step 2: Main User Story
- Story ID: US-03
- Title: Role-based Dashboard

As a logged-in user, I want to see a dashboard tailored to my role (student or faculty) so I can access relevant tools and actions quickly.

### Step 3: Acceptance Criteria
Positive Path
1. After login, user is redirected to their role-specific dashboard component.
2. UI shows only the actions available for that role.

Negative Path
1. Accessing a role-only route as the wrong role → redirect to authorized dashboard or show 'not authorized'.

### Subtasks
• Design login form (UI).
• Create login API endpoint.
• Connect front-end to backend.
• Implement session handling.
• Test login with valid/invalid inputs.

### Project Approach Alignment
- I. Requirements: Define role-specific requirements with faculty and students to ensure dashboards show necessary actions.
- II. Design: Create dashboard wireframes in Figma; design API responses to include role and permissions.
- III. Development: Implement role guards in routing and dashboard components (`src/pages/*Dashboard.jsx`) following sprint plans.
- IV. Testing: Add integration tests to verify role-based routing and component rendering.
- V. Deployment: Deploy dashboard features incrementally, validating permissions in staging.
- VI. Review: Demonstrate dashboard behavior during sprint reviews and collect UAT feedback.
