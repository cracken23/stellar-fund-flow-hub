
import { initializeDatabase } from '../utils/dbSetup';
import * as userService from './userService';
import * as transactionService from './transactionService';
import { v4 as uuidv4 } from 'uuid';
import { User, Transaction } from '../utils/mockData';

// Flag to track if database initialization has been attempted
let dbInitialized = false;

// Ensure database is initialized before accessing
const ensureDbInitialized = async () => {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
};

// AUTH ENDPOINTS IMPLEMENTATION
export const loginUser = async (email: string, password: string): Promise<User> => {
  await ensureDbInitialized();
  const user = await userService.authenticateUser(email, password);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  return user;
};

export const signupUser = async (name: string, email: string, password: string): Promise<User> => {
  await ensureDbInitialized();
  
  // Check if user already exists
  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }
  
  // Create account number (simple implementation for demo)
  const users = await userService.getAllUsers();
  const accountNumber = `1000${(10000 + users.length).toString().slice(1)}`;
  
  // Create new user
  const newUser = {
    name,
    email,
    password, // In production, this should be hashed
    role: 'user' as const,
    accountNumber,
    balance: 1000.00 // Default starting balance
  };
  
  return await userService.createUser(newUser);
};

// USER ENDPOINTS IMPLEMENTATION
export const getCurrentUser = async (userId: string): Promise<User> => {
  await ensureDbInitialized();
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const getAllUsers = async (): Promise<User[]> => {
  await ensureDbInitialized();
  return await userService.getAllUsers();
};

export const deleteUser = async (userId: string): Promise<void> => {
  await ensureDbInitialized();
  const success = await userService.deleteUser(userId);
  if (!success) {
    throw new Error('Failed to delete user');
  }
};

export const addUser = async (name: string, email: string, role: 'user' | 'admin'): Promise<User> => {
  await ensureDbInitialized();
  
  // Check if user already exists
  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }
  
  // Create account number
  const users = await userService.getAllUsers();
  const accountNumber = `1000${(10000 + users.length).toString().slice(1)}`;
  
  // Create new user with default password
  const newUser = {
    name,
    email,
    password: 'changeme123', // Default password
    role,
    accountNumber,
    balance: 1000.00 // Default starting balance
  };
  
  return await userService.createUser(newUser);
};

// TRANSACTION ENDPOINTS IMPLEMENTATION
export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  await ensureDbInitialized();
  return await transactionService.getTransactionsByUserId(userId);
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  await ensureDbInitialized();
  return await transactionService.getAllTransactions();
};

export const createTransaction = async (
  senderId: string,
  receiverId: string,
  amount: number,
  description: string
): Promise<Transaction> => {
  await ensureDbInitialized();
  
  // Get sender and receiver
  const sender = await userService.getUserById(senderId);
  const receiver = await userService.getUserById(receiverId);
  
  if (!sender || !receiver) {
    throw new Error('Invalid sender or receiver');
  }
  
  if (sender.balance < amount) {
    throw new Error('Insufficient funds');
  }
  
  // Create the transaction
  return await transactionService.createTransaction(
    senderId,
    receiverId,
    amount,
    description,
    sender.accountNumber,
    receiver.accountNumber
  );
};
