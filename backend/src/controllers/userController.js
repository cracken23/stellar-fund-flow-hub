
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { generateRandomAccountNumber } = require('../utils/helpers');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.executeQuery('SELECT * FROM Users');
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await db.executeQuery(
      'SELECT * FROM Users WHERE id = @param0',
      [req.params.id]
    );
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Failed to get user' });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Check if email already exists
    const existingUser = await db.executeQuery(
      'SELECT * FROM Users WHERE email = @param0',
      [email]
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Generate account details
    const userId = uuidv4();
    const accountNumber = generateRandomAccountNumber();
    
    // Create user in database
    await db.executeQuery(
      `INSERT INTO Users (id, name, email, password, role, accountNumber, balance)
       VALUES (@param0, @param1, @param2, @param3, @param4, @param5, @param6)`,
      [userId, name, email, password, role, accountNumber, 1000] // Default balance
    );
    
    // Get the created user
    const newUser = await db.executeQuery(
      'SELECT * FROM Users WHERE id = @param0',
      [userId]
    );
    
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await db.executeQuery(
      'SELECT * FROM Users WHERE id = @param0',
      [id]
    );
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await db.executeQuery(
      'DELETE FROM Users WHERE id = @param0',
      [id]
    );
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Authenticate user
exports.authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email and password
    const user = await db.executeQuery(
      'SELECT * FROM Users WHERE email = @param0 AND password = @param1',
      [email, password]
    );
    
    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    res.json(user[0]);
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

// Update user balance
exports.updateBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { balance } = req.body;
    
    // Validate balance
    if (balance === undefined || isNaN(balance)) {
      return res.status(400).json({ message: 'Valid balance is required' });
    }
    
    // Update balance
    await db.executeQuery(
      'UPDATE Users SET balance = @param0 WHERE id = @param1',
      [balance, id]
    );
    
    // Get updated user
    const updatedUser = await db.executeQuery(
      'SELECT * FROM Users WHERE id = @param0',
      [id]
    );
    
    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ message: 'Failed to update balance' });
  }
};
