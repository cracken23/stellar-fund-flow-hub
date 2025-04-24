
import { Transaction, User } from '../types/banking';
import { getAllUsers } from './userUtils';
import { v4 as uuidv4 } from 'uuid';

// Generate random transactions for a user
export const generateTransactions = (userId: string, count = 10): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const isCredit = Math.random() > 0.5;
    const amount = parseFloat((Math.random() * 1000 + 10).toFixed(2));
    
    transactions.push({
      id: uuidv4(),
      amount,
      type: isCredit ? 'credit' : 'debit',
      description: isCredit 
        ? `Deposit from ${['Payroll', 'Transfer', 'Refund'][Math.floor(Math.random() * 3)]}` 
        : `Payment to ${['Amazon', 'Utility', 'Grocery Store', 'Subscription'][Math.floor(Math.random() * 4)]}`,
      fromAccount: isCredit ? generateRandomAccountNumber() : undefined,
      toAccount: !isCredit ? generateRandomAccountNumber() : undefined,
      timestamp: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      status: Math.random() > 0.1 ? 'completed' : (Math.random() > 0.5 ? 'pending' : 'failed'),
    });
  }
  
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Get user transactions
export const getUserTransactions = (userId: string): Transaction[] => {
  const allTransactions = JSON.parse(localStorage.getItem('bankEaseTransactions') || '{}');
  return allTransactions[userId] || [];
};

// Get all transactions (for admin)
export const getAllTransactions = (): Transaction[] => {
  const allTransactions = JSON.parse(localStorage.getItem('bankEaseTransactions') || '{}');
  return Object.values(allTransactions).flat() as Transaction[];
};

// Add new transaction
export const addTransaction = (
  senderId: string, 
  receiverId: string, 
  amount: number, 
  description: string
): Transaction => {
  // Get users
  const users = getAllUsers();
  const sender = users.find((u: User) => u.id === senderId);
  const receiver = users.find((u: User) => u.id === receiverId);
  
  if (!sender || !receiver) {
    throw new Error('Invalid sender or receiver');
  }
  
  if (sender.balance < amount) {
    throw new Error('Insufficient funds');
  }
  
  // Update balances
  sender.balance -= amount;
  receiver.balance += amount;
  
  // Save updated users
  localStorage.setItem('bankEaseUsers', JSON.stringify(users));
  
  // Get transactions
  const allTransactions = JSON.parse(localStorage.getItem('bankEaseTransactions') || '{}');
  
  // Create new transactions (one for sender, one for receiver)
  const timestamp = new Date();
  const transactionId = uuidv4();
  
  // Debit transaction for sender
  const debitTransaction: Transaction = {
    id: transactionId,
    amount,
    type: 'debit',
    description: `Transfer to ${receiver.name} - ${description}`,
    toAccount: receiver.accountNumber,
    timestamp,
    status: 'completed',
  };
  
  // Credit transaction for receiver
  const creditTransaction: Transaction = {
    id: uuidv4(),
    amount,
    type: 'credit',
    description: `Transfer from ${sender.name} - ${description}`,
    fromAccount: sender.accountNumber,
    timestamp,
    status: 'completed',
  };
  
  // Update transactions
  if (!allTransactions[senderId]) allTransactions[senderId] = [];
  if (!allTransactions[receiverId]) allTransactions[receiverId] = [];
  
  allTransactions[senderId].unshift(debitTransaction);
  allTransactions[receiverId].unshift(creditTransaction);
  
  localStorage.setItem('bankEaseTransactions', JSON.stringify(allTransactions));
  
  return debitTransaction;
};
