
import { getConnection } from './db';

// SQL statements to create the required tables
const createUsersTable = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
CREATE TABLE Users (
    id NVARCHAR(50) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password NVARCHAR(100) NOT NULL, -- In production, store hashed passwords
    role NVARCHAR(10) NOT NULL CHECK (role IN ('user', 'admin')),
    accountNumber NVARCHAR(20) UNIQUE NOT NULL,
    balance DECIMAL(18, 2) NOT NULL DEFAULT 0
)
`;

const createTransactionsTable = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Transactions' AND xtype='U')
CREATE TABLE Transactions (
    id NVARCHAR(50) PRIMARY KEY,
    senderId NVARCHAR(50),
    receiverId NVARCHAR(50),
    amount DECIMAL(18, 2) NOT NULL,
    description NVARCHAR(255) NOT NULL,
    fromAccount NVARCHAR(20),
    toAccount NVARCHAR(20),
    timestamp DATETIME NOT NULL,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
    type NVARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
    FOREIGN KEY (senderId) REFERENCES Users(id),
    FOREIGN KEY (receiverId) REFERENCES Users(id)
)
`;

// Create default admin and user accounts
const createDefaultAccounts = `
IF NOT EXISTS (SELECT * FROM Users WHERE email='admin@example.com')
BEGIN
    INSERT INTO Users (id, name, email, password, role, accountNumber, balance)
    VALUES ('2', 'Admin User', 'admin@example.com', 'admin123', 'admin', '10000002', 10000.00)
END

IF NOT EXISTS (SELECT * FROM Users WHERE email='user@example.com')
BEGIN
    INSERT INTO Users (id, name, email, password, role, accountNumber, balance)
    VALUES ('1', 'John Doe', 'user@example.com', 'password123', 'user', '10000001', 5000.00)
END
`;

// Function to initialize the database
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    console.log('Initializing database schema...');
    const pool = await getConnection();
    
    // Create tables
    await pool.request().query(createUsersTable);
    console.log('Users table created or already exists');
    
    await pool.request().query(createTransactionsTable);
    console.log('Transactions table created or already exists');
    
    // Add default data
    await pool.request().query(createDefaultAccounts);
    console.log('Default accounts created if they did not exist');
    
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};

export default { initializeDatabase };
