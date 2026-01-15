# Project Overview

## Sushruta: Holistic Health Management for Seniors

**Sushruta** is a comprehensive digital health platform designed specifically for senior citizens. It bridges the gap between modern technology and elderly care, providing a user-friendly interface for managing health records, medications, appointments, and overall wellness.

The application is built with a focus on accessibility, ease of use, and role-based collaboration, allowing seniors, caretakers, and doctors to work together in maintaining the user's health.

---

## Technical Stack

The project utilizes the **MERN Stack**:

*   **MongoDB**: Database for storing user profiles, medical records, and logs.
*   **Express.js**: Backend framework for handling API requests and routing.
*   **React**: Frontend library for building the interactive user interface.
*   **Node.js**: Runtime environment for the backend server.
*   **Vite**: Build tool for fast frontend development.
*   **Tailwind CSS**: Utility-first CSS framework for styling.

---

## Application Architecture

The application is designed to operate in two modes:

### 1. Demo Mode (Frontend-Only)
*   **Purpose**: For quick demonstrations, UI testing, and user walkthroughs without a backend server.
*   **Mechanism**: Uses a `MockBackend` service (`src/services/mockBackend.js`) that stores data in the browser's `localStorage`.
*   **Features**: Simulates login, data persistence (client-side), and full feature interactivity.

### 2. Production Mode (Full Stack)
*   **Purpose**: For real-world deployment and data synchronization across devices.
*   **Mechanism**: Connects to the Express/Node.js backend (`backend/server.js`) and MongoDB database.
*   **Features**: Secure authentication (JWT), centralized database, and role-based access control (RBAC).

---

## Core Value Proposition

*   **Empowerment**: Gives seniors control over their health data.
*   **Connectivity**: Keeps family members and doctors informed.
*   **Simplicity**: specialized UI designed for older adults (large text, high contrast, intuitive navigation).
*   **Holistic Care**: Focuses not just on illness (medicines/appointments) but also on wellness (emotional health, physical activity).
