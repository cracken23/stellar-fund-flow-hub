
import { User, Transaction } from '../types/banking';
import { v4 as uuidv4 } from 'uuid';

// Sample user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    role: 'user',
    accountNumber: '10000001',
    balance: 5000.00
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    accountNumber: '10000002',
    balance: 10000.00
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    accountNumber: '10000003',
    balance: 3500.00
  }
];

// Sample transaction data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 500,
    type: 'debit',
    description: 'Payment for services',
    fromAccount: '10000001',
    toAccount: '10000003',
    timestamp: new Date('2023-05-15T10:30:00'),
    status: 'completed'
  },
  {
    id: '2',
    amount: 1500,
    type: 'credit',
    description: 'Salary deposit',
    fromAccount: '10000002',
    toAccount: '10000001',
    timestamp: new Date('2023-05-10T09:15:00'),
    status: 'completed'
  },
  {
    id: '3',
    amount: 250,
    type: 'debit',
    description: 'Online purchase',
    fromAccount: '10000003',
    toAccount: '10000002',
    timestamp: new Date('2023-05-05T14:20:00'),
    status: 'completed'
  }
];

// Store data in memory
let users = [...mockUsers];
let transactions = [...mockTransactions];

// User-related functions
export const getAllUsers = (): Promise<User[]> => {
  return Promise.resolve([...users]);
};

export const getUserById = (id: string): Promise<User | undefined> => {
  const user = users.find(u => u.id === id);
  return Promise.resolve(user);
};

export const addUser = (name: string, email: string, role: 'user' | 'admin'): Promise<User> => {
  const accountNumber = `1000${Math.floor(Math.random() * 9000 + 1000)}`;
  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    role,
    accountNumber,
    balance: 1000
  };
  users.push(newUser);
  return Promise.resolve(newUser);
};

export const removeUser = (userId: string): Promise<void> => {
  users = users.filter(user => user.id !== userId);
  return Promise.resolve();
};

export const updateUserBalance = (userId: string, newBalance: number): Promise<boolean> => {
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex].balance = newBalance;
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

// Transaction-related functions
export const getUserTransactions = (userId: string): Promise<Transaction[]> => {
  const userObj = users.find(u => u.id === userId);
  if (!userObj) return Promise.resolve([]);
  
  const accountNumber = userObj.accountNumber;
  const userTransactions = transactions.filter(t => 
    t.fromAccount === accountNumber || t.toAccount === accountNumber
  );
  
  return Promise.resolve([...userTransactions]);
};

export const getAllTransactions = (): Promise<Transaction[]> => {
  return Promise.resolve([...transactions]);
};

export const addTransaction = (
  senderId: string,
  receiverId: string,
  amount: number,
  description: string
): Promise<Transaction> => {
  const sender = users.find(u => u.id === senderId);
  const receiver = users.find(u => u.id === receiverId);
  
  if (!sender || !receiver) {
    return Promise.reject(new Error('Invalid sender or receiver'));
  }
  
  if (sender.balance < amount) {
    return Promise.reject(new Error('Insufficient funds'));
  }
  
  // Update balances
  sender.balance -= amount;
  receiver.balance += amount;
  
  // Create transaction
  const newTransaction: Transaction = {
    id: uuidv4(),
    amount,
    type: 'debit',
    description,
    fromAccount: sender.accountNumber,
    toAccount: receiver.accountNumber,
    timestamp: new Date(),
    status: 'completed'
  };
  
  transactions.push(newTransaction);
  return Promise.resolve(newTransaction);
};

// Authentication-related functions
export const authenticateUser = (email: string, password: string): Promise<User | null> => {
  // In a mock environment, we'll use predefined passwords for demo accounts
  const demoPasswords: Record<string, string> = {
    'user@example.com': 'password123',
    'admin@example.com': 'admin123',
    'jane@example.com': 'jane123'
  };
  
  const user = users.find(u => u.email === email);
  
  if (user && demoPasswords[email] === password) {
    return Promise.resolve(user);
  }
  
  return Promise.resolve(null);
};

// Initialize mock data
export const initializeMockData = (): void => {
  users = [...mockUsers];
  transactions = [...mockTransactions];
};

export const createUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<User> => {
  const newUser: User = {
    id: uuidv4(),
    name: userData.name,
    email: userData.email,
    role: userData.role,
    accountNumber: userData.accountNumber,
    balance: userData.balance
  };
  
  users.push(newUser);
  return newUser;
};
