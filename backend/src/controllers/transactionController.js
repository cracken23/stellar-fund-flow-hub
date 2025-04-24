
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await db.executeQuery('SELECT * FROM Transactions ORDER BY timestamp DESC');
    res.json(transactions);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ message: 'Failed to get transactions' });
  }
};

// Get transactions by user ID
exports.getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's account number
    const user = await db.executeQuery(
      'SELECT accountNumber FROM Users WHERE id = @param0',
      [userId]
    );
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const accountNumber = user[0].accountNumber;
    
    // Get transactions for this account
    const transactions = await db.executeQuery(
      `SELECT * FROM Transactions 
       WHERE fromAccount = @param0 OR toAccount = @param0 
       ORDER BY timestamp DESC`,
      [accountNumber]
    );
    
    res.json(transactions);
  } catch (error) {
    console.error('Error getting user transactions:', error);
    res.status(500).json({ message: 'Failed to get transactions' });
  }
};

// Create transaction
exports.createTransaction = async (req, res) => {
  try {
    const { senderId, receiverId, amount, description } = req.body;
    
    // Validate required fields
    if (!senderId || !receiverId || !amount || !description) {
      return res.status(400).json({ message: 'Sender ID, receiver ID, amount, and description are required' });
    }
    
    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    
    // Get sender and receiver details
    const sender = await db.executeQuery(
      'SELECT * FROM Users WHERE id = @param0',
      [senderId]
    );
    
    const receiver = await db.executeQuery(
      'SELECT * FROM Users WHERE id = @param0',
      [receiverId]
    );
    
    if (sender.length === 0 || receiver.length === 0) {
      return res.status(404).json({ message: 'Sender or receiver not found' });
    }
    
    const senderUser = sender[0];
    const receiverUser = receiver[0];
    
    // Check if sender has enough balance
    if (senderUser.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Begin transaction
    const pool = await db.getConnection();
    const transaction = new pool.transaction();
    
    try {
      await transaction.begin();
      
      // Update sender's balance
      await transaction.request().input('amount', amount)
        .input('senderId', senderId)
        .query('UPDATE Users SET balance = balance - @amount WHERE id = @senderId');
      
      // Update receiver's balance
      await transaction.request().input('amount', amount)
        .input('receiverId', receiverId)
        .query('UPDATE Users SET balance = balance + @amount WHERE id = @receiverId');
      
      // Create transaction records
      const transactionId = uuidv4();
      
      // Debit record (from sender)
      await transaction.request()
        .input('id', uuidv4())
        .input('amount', amount)
        .input('type', 'debit')
        .input('description', description)
        .input('fromAccount', senderUser.accountNumber)
        .input('toAccount', receiverUser.accountNumber)
        .input('status', 'completed')
        .query(`
          INSERT INTO Transactions (id, amount, type, description, fromAccount, toAccount, timestamp, status)
          VALUES (@id, @amount, @type, @description, @fromAccount, @toAccount, GETDATE(), @status)
        `);
      
      // Credit record (to receiver)
      await transaction.request()
        .input('id', uuidv4())
        .input('amount', amount)
        .input('type', 'credit')
        .input('description', description)
        .input('fromAccount', senderUser.accountNumber)
        .input('toAccount', receiverUser.accountNumber)
        .input('status', 'completed')
        .query(`
          INSERT INTO Transactions (id, amount, type, description, fromAccount, toAccount, timestamp, status)
          VALUES (@id, @amount, @type, @description, @fromAccount, @toAccount, GETDATE(), @status)
        `);
      
      // Commit transaction
      await transaction.commit();
      
      // Get the created transaction
      const createdTransaction = await db.executeQuery(
        'SELECT * FROM Transactions WHERE id = @param0',
        [transactionId]
      );
      
      res.status(201).json(createdTransaction[0]);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
};
