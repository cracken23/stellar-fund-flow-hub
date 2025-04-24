
import { Transaction } from '../types/banking';
import * as mockData from '../utils/mockData';

export const getTransactionsByUserId = async (userId: string): Promise<Transaction[]> => {
  try {
    return await mockData.getUserTransactions(userId);
  } catch (error) {
    console.error('Error getting user transactions:', error);
    throw error;
  }
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    return await mockData.getAllTransactions();
  } catch (error) {
    console.error('Error getting all transactions:', error);
    throw error;
  }
};

export const createTransaction = async (
  senderId: string,
  receiverId: string,
  amount: number,
  description: string
): Promise<Transaction> => {
  try {
    // Get sender and receiver details
    const users = await mockData.getAllUsers();
    const sender = users.find(u => u.id === senderId);
    const receiver = users.find(u => u.id === receiverId);
    
    if (!sender || !receiver) {
      throw new Error('Invalid sender or receiver');
    }
    
    return await mockData.addTransaction(
      senderId, 
      receiverId, 
      amount, 
      description
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};
