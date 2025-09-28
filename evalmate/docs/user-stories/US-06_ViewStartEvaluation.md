## US-06: Student — View Available/Pending Evaluations & Start Evaluation

### Step 1: Fields & Rules
- Pending evaluations list (published forms assigned or global published forms).
- Resume behavior: drafts saved per user and loadable.
- Start/resume actions should reflect deadline enforcement.

### Step 2: Main User Story
- Story ID: US-06
- Title: View & Start Evaluation

As a student, I want to see available or pending evaluations and start or resume them so I can submit peer feedback.

### Step 3: Acceptance Criteria
Positive Path
1. Student sees pending evaluations and can open one to start/resume.
2. Drafts persist and allow resuming progress.

Negative Path
1. Attempt to open a closed/deadline-passed form shows an appropriate message.

### Subtasks

### Subtasks
• Design login form (UI).
• Create login API endpoint.
• Connect front-end to backend.
• Implement session handling.
• Test login with valid/invalid inputs.

### Project Approach Alignment
- I. Requirements: Clarify how published forms are surfaced to students and draft/resume expectations.
- II. Design: Wireframe pending evaluations UI and resume flows in Figma; design storage for drafts in DB.
- III. Development: Implement endpoints to fetch available evaluations and save drafts; implement `PendingEvaluations.jsx`.
- IV. Testing: Add tests for resume behavior, draft persistence, and deadline enforcement.
- V. Deployment: Pilot the pending evaluation flows with a small student group.
- VI. Review: Include demo of start/resume flows during sprint reviews for feedback.
