
import { User } from '../types/banking';
import { getAllUsers as getMockUsers, addUser as addMockUser, removeUser as removeMockUser } from './mockData';

export const getAllUsers = async (): Promise<User[]> => {
  return getMockUsers();
};

export const addUser = async (name: string, email: string, role: 'user' | 'admin'): Promise<User> => {
  return addMockUser(name, email, role);
};

export const removeUser = async (userId: string): Promise<void> => {
  return removeMockUser(userId);
};
