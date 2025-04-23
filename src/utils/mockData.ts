
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  fromAccount?: string;
  toAccount?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  accountNumber: string;
  balance: number;
}

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
      timestamp: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in the last 30 days
      status: Math.random() > 0.1 ? 'completed' : (Math.random() > 0.5 ? 'pending' : 'failed'),
    });
  }
  
  // Sort by timestamp descending (newest first)
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Generate a random account number
export const generateRandomAccountNumber = (): string => {
  return `1000${Math.floor(Math.random() * 9000 + 1000)}`;
};

// Initialize mock data in localStorage if it doesn't exist
export const initializeMockData = () => {
  // Initialize users
  if (!localStorage.getItem('bankEaseUsers')) {
    const users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password123', // In a real app, this would be hashed
        role: 'user',
        accountNumber: '10000001',
        balance: 5000.00,
      },
      {
        id: '2',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        accountNumber: '10000002',
        balance: 10000.00,
      }
    ];
    localStorage.setItem('bankEaseUsers', JSON.stringify(users));
  }
  
  // Initialize transactions
  if (!localStorage.getItem('bankEaseTransactions')) {
    const users = JSON.parse(localStorage.getItem('bankEaseUsers') || '[]');
    const allTransactions: Record<string, Transaction[]> = {};
    
    users.forEach((user: User) => {
      allTransactions[user.id] = generateTransactions(user.id, 15);
    });
    
    localStorage.setItem('bankEaseTransactions', JSON.stringify(allTransactions));
  }
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
  const users = JSON.parse(localStorage.getItem('bankEaseUsers') || '[]');
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

// Get all users (for admin)
export const getAllUsers = (): User[] => {
  const users = JSON.parse(localStorage.getItem('bankEaseUsers') || '[]');
  // Remove passwords
  return users.map((user: any) => {
    const { password, ...safeUser } = user;
    return safeUser;
  });
};

// Add a new user (for admin)
export const addUser = (name: string, email: string, role: 'user' | 'admin'): User => {
  const users = JSON.parse(localStorage.getItem('bankEaseUsers') || '[]');
  
  if (users.some((u: any) => u.email === email)) {
    throw new Error('Email already registered');
  }
  
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: 'changeme123', // Default password
    role,
    accountNumber: `1000${(10000 + users.length).toString().slice(1)}`,
    balance: 1000.00,
  };
  
  users.push(newUser);
  localStorage.setItem('bankEaseUsers', JSON.stringify(users));
  
  const { password, ...safeUser } = newUser;
  return safeUser;
};

// Remove a user (for admin)
export const removeUser = (userId: string): void => {
  const users = JSON.parse(localStorage.getItem('bankEaseUsers') || '[]');
  const filteredUsers = users.filter((user: User) => user.id !== userId);
  
  if (users.length === filteredUsers.length) {
    throw new Error('User not found');
  }
  
  localStorage.setItem('bankEaseUsers', JSON.stringify(filteredUsers));
  
  // Also remove their transactions
  const allTransactions = JSON.parse(localStorage.getItem('bankEaseTransactions') || '{}');
  delete allTransactions[userId];
  localStorage.setItem('bankEaseTransactions', JSON.stringify(allTransactions));
};
