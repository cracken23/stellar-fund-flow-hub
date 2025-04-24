
import { executeQuery } from '../utils/db';
import { Transaction } from '../utils/mockData';
import { updateUserBalance } from './userService';

export const getTransactionsByUserId = async (userId: string): Promise<Transaction[]> => {
  try {
    const transactions = await executeQuery(
      `SELECT id, amount, type, description, fromAccount, toAccount, timestamp, status
       FROM Transactions
       WHERE fromUserId = @param0 OR toUserId = @param0
       ORDER BY timestamp DESC`,
      [userId]
    );
    
    return transactions as Transaction[];
  } catch (error) {
    console.error('Error getting user transactions:', error);
    throw error;
  }
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactions = await executeQuery(
      `SELECT id, amount, type, description, fromAccount, toAccount, timestamp, status
       FROM Transactions
       ORDER BY timestamp DESC`
    );
    
    return transactions as Transaction[];
  } catch (error) {
    console.error('Error getting all transactions:', error);
    throw error;
  }
};

export const createTransaction = async (
  senderId: string,
  receiverId: string,
  amount: number,
  description: string,
  senderAccount: string,
  receiverAccount: string
): Promise<Transaction> => {
  try {
    // Start a transaction to ensure atomicity
    const pool = await import('../utils/db').then(db => db.getConnection());
    const transaction = new (await import('mssql')).Transaction(pool);
    
    await transaction.begin();
    
    try {
      // Create transaction record
      const timestamp = new Date();
      const result = await new (await import('mssql')).Request(transaction)
        .input('senderId', senderId)
        .input('receiverId', receiverId)
        .input('amount', amount)
        .input('description', description)
        .input('fromAccount', senderAccount)
        .input('toAccount', receiverAccount)
        .input('timestamp', timestamp)
        .input('status', 'completed')
        .query(`
          INSERT INTO Transactions (senderId, receiverId, amount, description, fromAccount, toAccount, timestamp, status, type)
          OUTPUT INSERTED.id, INSERTED.amount, 'debit' AS type, INSERTED.description, INSERTED.fromAccount, INSERTED.toAccount, INSERTED.timestamp, INSERTED.status
          VALUES (@senderId, @receiverId, @amount, @description, @fromAccount, @toAccount, @timestamp, @status, 'debit')
        `);
      
      // Update sender's balance (deduct amount)
      await new (await import('mssql')).Request(transaction)
        .input('userId', senderId)
        .input('amount', amount)
        .query(`
          UPDATE Users
          SET balance = balance - @amount
          WHERE id = @userId
        `);
      
      // Update receiver's balance (add amount)
      await new (await import('mssql')).Request(transaction)
        .input('userId', receiverId)
        .input('amount', amount)
        .query(`
          UPDATE Users
          SET balance = balance + @amount
          WHERE id = @userId
        `);
      
      // Commit the transaction
      await transaction.commit();
      
      return result.recordset[0] as Transaction;
    } catch (error) {
      // If there's an error, roll back the transaction
      await transaction.rollback();
      console.error('Error in transaction, rolled back:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};
