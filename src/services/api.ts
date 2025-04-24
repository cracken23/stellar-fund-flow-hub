
import { User, Transaction } from '../types/banking';

// Base API URL - in a real app, would come from environment variables
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for making API requests
const fetchWithErrorHandling = async (url: string, options: RequestInit = {}): Promise<any> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

// AUTH ENDPOINTS
export const loginUser = async (email: string, password: string): Promise<User> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const signupUser = async (
  name: string, 
  email: string, 
  password: string
): Promise<User> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
};

// USER ENDPOINTS
export const getCurrentUser = async (): Promise<User> => {
  // In a real app with JWT, we would validate the token here
  // For now, we'll assume the user ID is stored in localStorage
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('User not authenticated');
  
  return fetchWithErrorHandling(`${API_BASE_URL}/users/${userId}`);
};

export const getAllUsers = async (): Promise<User[]> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/users`);
};

export const deleteUser = async (userId: string): Promise<void> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });
};

export const addUser = async (
  name: string, 
  email: string, 
  role: 'user' | 'admin'
): Promise<User> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/users`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password: 'defaultPassword123', role }),
  });
};

// TRANSACTION ENDPOINTS
export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/transactions/user/${userId}`);
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/transactions`);
};

export const createTransaction = async (
  senderId: string,
  receiverId: string,
  amount: number,
  description: string
): Promise<Transaction> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    body: JSON.stringify({ senderId, receiverId, amount, description }),
  });
};

// Check if we have a valid API connection
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    await fetch(`${API_BASE_URL}/health`);
    return true;
  } catch (error) {
    console.warn('API connection failed, falling back to mock data');
    return false;
  }
};
