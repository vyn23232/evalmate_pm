## US-05: Forms Management (Faculty)

### Step 1: Fields & Rules
- Forms list with metadata: title, status (draft/published), created date, actions (edit/delete/publish).
- Permission: only the creator (or faculty role) may edit drafts.

### Step 2: Main User Story
- Story ID: US-05
- Title: Forms Management

As a faculty member, I want to manage my evaluation forms (drafts, publish, delete) so I can control the lifecycle of forms.

### Step 3: Acceptance Criteria
Positive Path
1. Display list of forms with actionable controls.
2. Drafts open in builder for editing; published forms become available to students.

Negative Path
1. Deleting prompts confirmation; published deletion policy should be clarified.

### Subtasks
- Implement `FormsManagement.jsx` UI and actions.
- Add publish & delete endpoints/actions in `FormStore.js`.
- Add confirmation dialogs for deletes and critical changes.

### Project Approach Alignment
- I. Requirements: Determine lifecycle rules for draft vs published forms through faculty consultation.
- II. Design: Design forms list and status indicators in Figma; plan DB schema for form states.
- III. Development: Implement list, publish, and delete APIs in Flask and wire to `FormsManagement.jsx`.
- IV. Testing: Test publish and delete flows including permission checks.
- V. Deployment: Roll out form management to faculty users first, monitor behavior.
- VI. Review: Include form lifecycle reviews in sprint retrospectives and stakeholder demos.
