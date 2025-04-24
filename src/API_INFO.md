
# Banking API Mock Implementation

This project uses a mock implementation of the banking API for frontend development. In a production environment, these API calls would be directed to a real backend server that connects to an Azure SQL Database.

## Mock Data

The mock implementation is stored in `src/utils/mockData.ts` and includes:

- User data (admin and regular users)
- Transaction data
- Authentication functions
- CRUD operations for users and transactions

## Using in Production

To use a real backend API:

1. Create a Node.js backend service
2. Install the `mssql` package in the backend
3. Move the database connection code to the backend
4. Create REST API endpoints that the frontend can call
5. Update the API services in this project to call those endpoints

## Azure SQL Database

The `.env.example` file contains placeholders for Azure SQL Database connection parameters. In a production setup, these would be used by the backend service, not directly in the frontend code.

