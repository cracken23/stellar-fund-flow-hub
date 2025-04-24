
import { User } from '../types/banking';
import { generateRandomAccountNumber } from './helpers';
import { v4 as uuidv4 } from 'uuid';

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
    accountNumber: generateRandomAccountNumber(users.length),
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
