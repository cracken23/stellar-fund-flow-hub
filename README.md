
# Banking Application

A full-stack banking application with user and admin portals.

## Project Structure

- `frontend/`: React frontend application with user and admin dashboards
- `backend/`: Express.js API server connecting to Azure SQL Database

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder: `cd backend`
2. Create a `.env` file based on `.env.example` with your Azure SQL Database credentials
3. Install dependencies: `npm install`
4. Run the server: `npm run dev`

### Frontend Setup

1. In the root directory, install dependencies: `npm install`
2. Start the frontend application: `npm run dev`

## Features

- User authentication (login/signup)
- User dashboard with account overview
- Transaction history
- Funds transfer between accounts
- Admin portal with user management
- Admin transaction monitoring
- Banking statistics and analytics

## Technologies Used

- **Frontend:** React, TypeScript, TailwindCSS, shadcn/ui
- **Backend:** Node.js, Express
- **Database:** Azure SQL Database
- **State Management:** React Context API, TanStack Query
- **Visualization:** Recharts

## API Endpoints

See the `backend/README.md` for a complete list of available API endpoints.
