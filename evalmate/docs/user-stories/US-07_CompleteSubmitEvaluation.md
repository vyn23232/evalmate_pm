## US-07: Complete & Submit Evaluation (Student)

### Step 1: Fields & Rules
- Question types: rating, multiple choice, text, checkbox.
- Required/optional per question.
- Save as draft vs Submit final.
- Anonymity: hides student identity in stored submission if enabled.

### Step 2: Main User Story
- Story ID: US-07
- Title: Complete and Submit Evaluation

As a student, I want to fill out an evaluation form and submit it so I can provide feedback for peers.

### Step 3: Acceptance Criteria
Positive Path
1. Student can fill, save drafts, and submit forms; successful submissions are recorded and removed from pending.

Negative Path
1. Submission with missing required answers is blocked and shows inline errors.
2. Submissions after deadline are prevented.

### Subtasks
• Design login form (UI).
• Create login API endpoint.
• Connect front-end to backend.
• Implement session handling.
• Test login with valid/invalid inputs.

### Project Approach Alignment
- I. Requirements: Define required question types, anonymity rules, and submission policies with faculty.
- II. Design: Prototype evaluation UI and submission flow in Figma; design how anonymity metadata is stored.
- III. Development: Implement submission endpoints in Flask and `EvaluationForm.jsx` client logic; use `EvaluationStore.js` for local state.
- IV. Testing: Ensure submissions are validated, drafts saved, and anonymity preserved through unit and integration tests.
- V. Deployment: Release submission feature during a sprint pilot and monitor data integrity.
- VI. Review: Validate submission flows during UAT with sample evaluations.
