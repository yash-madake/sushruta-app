# Role-Based Authentication

Sushruta implements a secure Role-Based Access Control (RBAC) system to tailor the user experience and ensure data privacy.

## Roles

### 1. Senior (Default)
*   **Target User**: The elderly individual using the app for self-care.
*   **Access Level**:
    *   Full access to their own dashboard.
    *   Can view and manage meds, appointments, and logs.
    *   Cannot view other users' data.

### 2. Caretaker
*   **Target User**: Family member, nurse, or guardian.
*   **Access Level**:
    *   Can monitor the connected Senior's vitals and adherence.
    *   Can set reminders and add medical records for the Senior.
    *   Safety features: Access to GPS tracking and Geofencing (if enabled).

### 3. Doctor
*   **Target User**: Medical professional.
*   **Access Level**:
    *   Clinical Dashboard view.
    *   Review patient medical history, reports, and vital trends.
    *   Cannot edit personal profile details of the Senior.

## Implementation Details

### Frontend (React)
*   **Component**: `src/features/auth/AuthContainer.jsx` manages the login/signup flows.
*   **State**: `src/services/authService.js` uses `sessionStorage` to persist the logged-in user state across refreshes.
*   **Role Selection**: Users select their role during the signup process (`RoleSelection.jsx`).
*   **Conditional Rendering**: The UI adapts based on `user.role` (e.g., hiding the "Pharmacy" tab for Doctors, or showing "Patient List" instead).

### Backend (Node/Express)
*   **Routes**: `backend/routes/authRoutes.js` handles registration and login.
*   **Model**: `backend/models/User.js` includes a `role` field (enum: `['senior', 'caretaker', 'doctor']`).
*   **Middleware**: `backend/middleware/authMiddleware.js` verifies the JWT token and can protect routes based on specific roles (e.g., `admin` or specific role checks).

## Security
*   **Passwords**: Hashed using `bcryptjs` before storage.
*   **Tokens**: JSON Web Tokens (JWT) are issued upon successful login to authenticate API requests.
