
import { Transaction } from '../types/banking';
import { getUserTransactions as getMockUserTransactions, addTransaction as addMockTransaction } from './mockData';

export const getTransactionsByUserId = async (userId: string): Promise<Transaction[]> => {
  return getMockUserTransactions(userId);
};

export const createTransaction = async (
  senderId: string,
  receiverId: string,
  amount: number,
  description: string
): Promise<Transaction> => {
  return addMockTransaction(senderId, receiverId, amount, description);
};
