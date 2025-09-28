## US-12: Profile Management (Student / Faculty)

### Step 1: Fields & Rules
- Editable fields: name, contact number, profile picture, notification preferences.
- Email may be read-only depending on policy.
- Validation: phone numeric and minimum digits.

### Step 2: Main User Story
- Story ID: US-12
- Title: Update Profile

As a user, I want to update my profile so my information is current and my preferences are applied.

### Step 3: Acceptance Criteria
Positive Path
1. Profile loads with existing info; editing and saving persists changes.

Negative Path
1. Invalid inputs show inline validation errors.

### Subtasks
- Implement `StudentProfile.jsx` and wire to `AuthContext` or profile API.
- Add file upload flow for profile pictures (or accept URL).
- Add tests for validation and save.
• Design login form (UI).
• Create login API endpoint.
• Connect front-end to backend.
• Implement session handling.
• Test login with valid/invalid inputs.

### Project Approach Alignment
- I. Requirements: Determine which profile fields are editable and privacy rules.
- II. Design: Prototype profile edit UI and picture upload flows in Figma.
- III. Development: Implement profile endpoints in Flask and `StudentProfile.jsx` integration with `AuthContext.jsx`.
- IV. Testing: Validate file uploads, data validation, and permission boundaries.
- V. Deployment: Deploy profile changes with migration scripts if schema updates required.
- VI. Review: Confirm privacy and data retention with stakeholders.
