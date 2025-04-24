
import * as mockData from '../utils/mockData';
import { User, Transaction } from '../types/banking';

// Initialize mock data
let initialized = false;
const ensureMockDataInitialized = () => {
  if (!initialized) {
    mockData.initializeMockData();
    initialized = true;
  }
};

// AUTH ENDPOINTS IMPLEMENTATION
export const loginUser = async (email: string, password: string): Promise<User> => {
  ensureMockDataInitialized();
  const user = await mockData.authenticateUser(email, password);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  return user;
};

export const signupUser = async (name: string, email: string, password: string): Promise<User> => {
  ensureMockDataInitialized();
  
  // Check if user already exists
  const allUsers = await mockData.getAllUsers();
  const existingUser = allUsers.find(u => u.email === email);
  
  if (existingUser) {
    throw new Error('Email already registered');
  }
  
  // Create account number
  const users = await mockData.getAllUsers();
  const accountNumber = `1000${(10000 + users.length).toString().slice(1)}`;
  
  // Create new user
  const newUser = {
    name,
    email,
    password,
    role: 'user' as const,
    accountNumber,
    balance: 1000.00
  };
  
  return await mockData.createUser(newUser);
};

// USER ENDPOINTS IMPLEMENTATION
export const getCurrentUser = async (userId: string): Promise<User> => {
  ensureMockDataInitialized();
  const user = await mockData.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const getAllUsers = async (): Promise<User[]> => {
  ensureMockDataInitialized();
  return await mockData.getAllUsers();
};

export const deleteUser = async (userId: string): Promise<void> => {
  ensureMockDataInitialized();
  await mockData.removeUser(userId);
};

export const addUser = async (name: string, email: string, role: 'user' | 'admin'): Promise<User> => {
  ensureMockDataInitialized();
  
  // Check if user already exists
  const allUsers = await mockData.getAllUsers();
  const existingUser = allUsers.find(u => u.email === email);
  
  if (existingUser) {
    throw new Error('Email already registered');
  }
  
  // Create new user
  return await mockData.addUser(name, email, role);
};

// TRANSACTION ENDPOINTS IMPLEMENTATION
export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  ensureMockDataInitialized();
  return await mockData.getUserTransactions(userId);
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  ensureMockDataInitialized();
  return await mockData.getAllTransactions();
};

export const createTransaction = async (
  senderId: string,
  receiverId: string,
  amount: number,
  description: string
): Promise<Transaction> => {
  ensureMockDataInitialized();
  
  return await mockData.addTransaction(senderId, receiverId, amount, description);
};
