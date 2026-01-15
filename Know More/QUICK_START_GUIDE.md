# Quick Start Guide

Follow these instructions to get Sushruta running on your local machine.

## Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [MongoDB](https://www.mongodb.com/try/download/community) (for Production Mode)

## Installation

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd sushruta
    ```

2.  **Install Dependencies**
    *   **Root (Frontend)**:
        ```bash
        npm install
        ```
    *   **Backend**:
        ```bash
        cd backend
        npm install
        cd ..
        ```

## Running the Application

### Option A: Demo Mode (Frontend Only)
This mode uses `MockBackend` and does **not** require a running MongoDB instance.

1.  Start the Vite development server:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to `http://localhost:5173`.
3.  The app will load with sample data pre-populated in `localStorage`.

### Option B: Production Mode (Full Stack)
This mode connects the React frontend to the Express backend and MongoDB.

1.  **Setup Environment Variables**
    *   Create a `.env` file in the `backend/` directory.
    *   Add the following variables:
        ```env
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/sushruta
        JWT_SECRET=your_jwt_secret_key
        NODE_ENV=development
        ```

2.  **Start the Backend Server**
    ```bash
    cd backend
    npm start
    # or for development with auto-restart:
    # npm run server
    ```
    *   Verify the server is running (default: `http://localhost:5000`).

3.  **Start the Frontend**
    *   In a new terminal, run:
        ```bash
        npm run dev
        ```
    *   The frontend will now attempt to communicate with the backend API (ensure API service integration is active in `src/services/api.js`).

## Troubleshooting

*   **Port Conflicts**: Ensure ports `5173` (Vite) and `5000` (Express) are free.
*   **MongoDB Error**: If the backend fails to connect, check if your local MongoDB service is running.
*   **CORS Issues**: If API calls fail, check the `cors` configuration in `backend/server.js`.
