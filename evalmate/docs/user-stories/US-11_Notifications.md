## US-11: In-app Notifications & Notification Dropdown

### Step 1: Fields & Rules
- Notification types: new submission, approaching deadline, system messages.
- Notification state: read/unread, timestamp, link to target.

### Step 2: Main User Story
- Story ID: US-11
- Title: Notifications

As a user, I want to receive notifications about new submissions and deadlines so I don’t miss important actions.

### Step 3: Acceptance Criteria
Positive Path
1. Notifications appear in `NotificationDropdown.jsx` with unread indicators.
2. Clicking a notification navigates to the related item and marks it read.

Negative Path
1. No notifications → show empty state.

### Subtasks
- Wire `NotificationDropdown.jsx` into `Header.jsx`.
- Add notification store or use existing global store for messages.
- Add tests for read/unread and navigation behavior.
• Design login form (UI).
• Create login API endpoint.
• Connect front-end to backend.
• Implement session handling.
• Test login with valid/invalid inputs.

### Project Approach Alignment
- I. Requirements: Define notification triggers and retention rules.
- II. Design: Mock notification dropdown and states (unread/read) in Figma.
- III. Development: Implement notification store, websocket or polling backend, and `NotificationDropdown.jsx` integration.
- IV. Testing: Test delivery, read/unread toggles, and navigation actions.
- V. Deployment: Monitor message delivery and backend load; disable heavy polling on small instances.
- VI. Review: Collect feedback on notification usefulness and adjust triggers.
