# Implementation Summary

This document provides a technical overview of the project structure and key components.

## Directory Structure

### `src/` (Frontend)
*   **`components/`**: Reusable UI elements (Buttons, Inputs, Modals, Loaders).
*   **`features/`**: Feature-specific modules. Each feature is self-contained (e.g., `medicine/`, `auth/`, `dashboard/`).
*   **`layout/`**: Structural components like `Sidebar`, `Header`, and `RightPanel`.
*   **`services/`**: logic for data handling (`mockBackend.js`, `authService.js`, `api.js`).
*   **`styles/`**: Global styles and Tailwind configurations.
*   **`App.jsx`**: Main entry point; handles global state (User, Data) and routing (Tab switching).

### `backend/` (Server)
*   **`config/`**: Database connection logic (`db.js`).
*   **`controllers/`**: Request handling logic.
*   **`models/`**: Mongoose schemas defining data structure (`User.js`, `Medicine.js`, etc.).
*   **`routes/`**: API endpoint definitions.
*   **`middleware/`**: Auth protection and error handling.
*   **`server.js`**: Application entry point.

## Key Design Decisions

### 1. Centralized State Management (Frontend)
*   Instead of a complex library like Redux, the app uses a **Lifted State** approach in `App.jsx`.
*   The `data` object holds the entire application state (meds, user info, appointments).
*   A `refreshData` function is passed down to children to trigger re-renders when data changes in the `MockBackend` or API.

### 2. Service-Oriented Architecture
*   UI components do not access `localStorage` or APIs directly.
*   They call methods in `services/` (e.g., `MockBackend.getData()`, `AuthService.login()`).
*   This abstraction allows swapping the Mock Backend for the Real API with minimal UI changes.

### 3. Tailwind for Styling
*   Rapid UI development using utility classes.
*   Custom animations (fade-in, slide-up) defined in `src/styles/animations.css`.

### 4. Modular Features
*   Each major feature (Medicine, Reports, Wellness) is a separate component in `features/`.
*   This makes the codebase easier to navigate and maintain.

## Dependencies

*   **Chart.js / react-chartjs-2**: For visualizing health trends.
*   **@phosphor-icons/web**: For consistent, high-quality iconography.
*   **react-router-dom**: (Available but currently using conditional rendering for tabs).
*   **lucide-react**: Additional icons.
