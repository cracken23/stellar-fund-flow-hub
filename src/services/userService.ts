
import { User } from '../types/banking';
import * as mockData from '../utils/mockData';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const users = await mockData.getAllUsers();
    const user = users.find(u => u.email === email);
    return user || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const user = await mockData.getUserById(id);
    return user || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    return await mockData.getAllUsers();
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const createUser = async (user: Omit<User, 'id'> & { password: string }): Promise<User> => {
  try {
    return await mockData.createUser(user);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUserBalance = async (userId: string, newBalance: number): Promise<boolean> => {
  try {
    return await mockData.updateUserBalance(userId, newBalance);
  } catch (error) {
    console.error('Error updating user balance:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await mockData.removeUser(userId);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    return await mockData.authenticateUser(email, password);
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};
