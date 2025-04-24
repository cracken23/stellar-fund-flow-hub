
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { generateRandomAccountNumber } = require('./helpers');

// Create database tables and initial data
const initializeDatabase = async () => {
  console.log('Initializing database...');
  
  try {
    // Create Users table
    await db.executeQuery(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      CREATE TABLE Users (
        id VARCHAR(40) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(10) NOT NULL,
        accountNumber VARCHAR(20) NOT NULL UNIQUE,
        balance DECIMAL(18,2) NOT NULL DEFAULT 0
      )
    `);

    // Create Transactions table
    await db.executeQuery(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Transactions' AND xtype='U')
      CREATE TABLE Transactions (
        id VARCHAR(40) PRIMARY KEY,
        amount DECIMAL(18,2) NOT NULL,
        type VARCHAR(10) NOT NULL,
        description VARCHAR(255) NOT NULL,
        fromAccount VARCHAR(20),
        toAccount VARCHAR(20),
        timestamp DATETIME NOT NULL DEFAULT GETDATE(),
        status VARCHAR(20) NOT NULL
      )
    `);

    // Check if admin user exists, create if not
    const adminUsers = await db.executeQuery(`
      SELECT * FROM Users WHERE email = 'admin@bank.com'
    `);

    if (adminUsers.length === 0) {
      // Create admin user
      await db.executeQuery(`
        INSERT INTO Users (id, name, email, password, role, accountNumber, balance)
        VALUES (@param0, @param1, @param2, @param3, @param4, @param5, @param6)
      `, [
        uuidv4(),
        'Admin User',
        'admin@bank.com',
        'admin123', // In production, use proper password hashing
        'admin',
        generateRandomAccountNumber(),
        10000
      ]);

      // Create sample user
      await db.executeQuery(`
        INSERT INTO Users (id, name, email, password, role, accountNumber, balance)
        VALUES (@param0, @param1, @param2, @param3, @param4, @param5, @param6)
      `, [
        uuidv4(),
        'John Doe',
        'john@example.com',
        'password123', // In production, use proper password hashing
        'user',
        generateRandomAccountNumber(),
        5000
      ]);
    }

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};

module.exports = {
  initializeDatabase
};
