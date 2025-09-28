## US-09: Faculty Reports & Analytics

### Step 1: Fields & Rules
- Aggregate metrics: participation rates, average scores, trends over time.
- Filters: by form, date range, group (if group support present).
- Export: CSV/Excel export of raw or aggregated data.

### Step 2: Main User Story
- Story ID: US-09
- Title: Reports & Analytics

As a faculty member, I want to view analytics and export reports so I can analyze student responses and participation.

### Step 3: Acceptance Criteria
Positive Path
1. Reports show aggregated data for selected form/timeframe and support basic filtering.
2. Export button generates downloadable CSV of responses or metrics.

Negative Path
1. No submissions → show empty state and guidance.

### Subtasks
• Design login form (UI).
• Create login API endpoint.
• Connect front-end to backend.
• Implement session handling.
• Test login with valid/invalid inputs.

### Project Approach Alignment
- I. Requirements: Define which aggregated metrics are needed and export formats.
- II. Design: Create dashboard mockups showing charts, filters, and export controls (Figma).
- III. Development: Implement aggregation endpoints in Flask and use charting libraries in `Reports.jsx`.
- IV. Testing: Validate calculations, filter correctness, and export integrity with unit and integration tests.
- V. Deployment: Deploy analytics module with monitoring for heavy queries; use caching if necessary.
- VI. Review: Review metrics with faculty and iterate on useful KPIs.
