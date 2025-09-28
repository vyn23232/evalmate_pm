## US-14: Form Options — Anonymity, Deadlines, Submission Policies

### Step 1: Fields & Rules
- Anonymity toggle: when enabled, submissions do not store user identity with responses.
- Deadline: date/time field; forms closed after deadline.
- Submission policy: allow drafts, limit number of submissions, etc.

### Step 2: Main User Story
- Story ID: US-14
- Title: Form Options & Policies

As a faculty member, I want to configure anonymity, deadlines, and submission rules so my form behaves according to evaluation requirements.

### Step 3: Acceptance Criteria
Positive Path
1. Anonymity prevents identity being saved with the submission.
2. Deadline enforcement prevents submissions after expiry.
3. Submission policy controls draft behavior and allowed attempts.

Negative Path
1. Past deadline set → show validation and prevent save/publish.

### Subtasks
- Expose options in `FormBuilder.jsx` UI.
- Enforce policies in `EvaluationForm.jsx` and `EvaluationStore.js`.
- Add tests for anonymity and deadline enforcement.
• Design login form (UI).
• Create login API endpoint.
• Connect front-end to backend.
• Implement session handling.
• Test login with valid/invalid inputs.

### Project Approach Alignment
- I. Requirements: Define anonymity semantics and submission policy options.
- II. Design: Prototype toggles and deadline pickers in Figma.
- III. Development: Implement `FormBuilder.jsx` options and enforce them in `EvaluationForm.jsx` and server-side APIs.
- IV. Testing: Test anonymity, deadline enforcement, and edge cases.
- V. Deployment: Deploy with migration scripts for existing forms if policy structure changes.
- VI. Review: Validate that policies meet faculty needs.
