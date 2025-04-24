
# Banking API Backend

This is the backend API for the Banking application. It provides endpoints for user management, authentication, and transactions.

## Setup

1. Create a `.env` file based on `.env.example` with your Azure SQL Database credentials
2. Install dependencies: `npm install`
3. Run the server: `npm start` or `npm run dev` for development mode with hot reloading

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/signup` - Create a new user account

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `DELETE /api/users/:id` - Delete a user
- `PUT /api/users/:id/balance` - Update user balance

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/user/:userId` - Get user's transactions
- `POST /api/transactions` - Create a new transaction

## Database

The application uses Azure SQL Database. The database schema is created automatically when the server starts.
