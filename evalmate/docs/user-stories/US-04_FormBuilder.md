## US-04: Form Builder — Create & Edit Evaluation Forms

### Step 1: Define the Fields & Rules
- Form Title: required.
- Questions: list of objects with type and settings.
  - Types supported: rating, multiple choice, text, checkbox.
- Options
  - Anonymity toggle.
  - Deadline (date/time).
  - Save as Draft / Publish.
- Validation
  - At least one question to publish.
  - Deadline cannot be in the past.

### Step 2: Main User Story
- Story ID: US-04
- Title: Create/Edit Evaluation Form (Form Builder)

As a faculty member, I want to build evaluation forms with different question types and options so I can collect peer evaluations.

### Step 3: Acceptance Criteria
Positive Path
1. Faculty can add/edit/reorder/remove questions and set options.
2. Drafts are saved and publishing sets the form available to students.

Negative Path
1. Publishing without title or questions → show validation errors.
2. Invalid deadline → prevent save/publish.

### Subtasks
- Implement UI in `src/pages/faculty/FormBuilder.jsx`.
- Add question components and dynamic list behavior.
- Wire to `FormStore.js` for persistence.
- Add tests for create, edit, publish, draft flows.

### Project Approach Alignment
- I. Requirements: Capture form fields, anonymity, deadlines, and submission policy requirements from faculty interviews.
- II. Design: Prototype Form Builder UI in Figma; design DB schema to store forms and question types in Supabase/MySQL.
- III. Development: Implement form creation endpoints in Flask and integrate with `FormStore.js` during sprints.
- IV. Testing: Unit tests for question validation and integration tests for save/publish workflows.
- V. Deployment: Release form builder to pilot classes and monitor usage.
- VI. Review: Use sprint reviews to show form building and publish flows to stakeholders.
