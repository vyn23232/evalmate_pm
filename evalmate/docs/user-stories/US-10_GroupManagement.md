## US-10: Group Management (Faculty)

### Step 1: Fields & Rules
- Group name: required and unique per faculty.
- Members: list of students assigned to the group.

### Step 2: Main User Story
- Story ID: US-10
- Title: Group Management

As a faculty member, I want to create and manage student groups so I can organize evaluations and filter reports.

### Step 3: Acceptance Criteria
Positive Path
1. Create, edit, and delete groups; assign/unassign members.

Negative Path
1. Duplicate group name → show error.
2. Deleting group with associated forms/submissions → warn and handle references.

### Subtasks
- Implement `GroupManagement.jsx` UI.
- Persist group data in store/backend.
- Add confirmation flows for deletes.
• Design login form (UI).
• Create login API endpoint.
• Connect front-end to backend.
• Implement session handling.
• Test login with valid/invalid inputs.

### Project Approach Alignment
- I. Requirements: Define essential group operations and membership rules.
- II. Design: Prototype group management UI in Figma and workflows for assigning members.
- III. Development: Implement `GroupManagement.jsx`, backend endpoints, and `FormStore.js` integration.
- IV. Testing: Test creation/edit/delete workflows, member assignments, and edge cases (empty groups).
- V. Deployment: Deploy behind feature flag if needed; monitor data integrity.
- VI. Review: Verify group filtering works in reports and forms.
