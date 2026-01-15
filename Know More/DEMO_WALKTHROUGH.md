# Demo Walkthrough

This guide explains how to explore the application in "Demo Mode" (Frontend Only).

## The Mock Engine
To ensure a smooth demonstration without needing a complex backend setup, the app uses a `MockBackend` service.
*   **Initialization**: On first load, `src/services/mockBackend.js` populates the browser's `localStorage` with a seed dataset (User profile, 2 sample medicines, vital history).
*   **Persistence**: Any changes you make (adding a medicine, checking a checkbox) are saved to your browser's storage and will persist even after a refresh.
*   **Reset**: To reset the demo data, you can clear your browser's "Local Storage" for this site.

## User Journey

### 1. Authentication
*   **Login Screen**: You will be greeted by the login page.
*   **Demo Credentials**:
    *   Since this is a mock backend, you can technically sign up with *any* credentials.
    *   **Recommended**: Use the "Sign Up" flow to see the onboarding experience.
    *   Select "Senior" as your role to see the main dashboard.

### 2. The Dashboard
*   **Overview**: You will see the "Good Morning" greeting, current date, and a summary of tasks.
*   **Vitals**: Notice the steps, heart rate, and BP cards. These numbers are part of the mock dataset.
*   **Water Reminders**: The app automatically generates hourly water reminders. Try checking one off!

### 3. Medicine Tracker
*   Click the "Medicine" tab in the sidebar.
*   **Action**: Try marking "Metformin" as taken. Notice the visual change (green checkmark).
*   **Add Med**: Click the "+" button to add a new medicine. It will appear in the list instantly.

### 4. Wellness & Reports
*   Explore the "Wellness" tab to see charts (using Chart.js) visualizing the mock history data.
*   Go to "Reports" to see the UI for uploading documents (Note: In demo mode, this simulates an upload without sending files to a server).

### 5. Settings / Profile
*   Go to the "Profile" tab.
*   Edit a field (e.g., Emergency Contact) and save.
*   Refresh the page. Your change should still be there!

## Troubleshooting
*   **"Database Locked"**: If you see an alert about storage being full, clear your local storage.
*   **Mobile View**: Resize your browser window to simulate a mobile device. The sidebar becomes a hamburger menu, and the layout adjusts.
