
import { User, Transaction } from '../utils/mockData';

// Base API URL - in a real app, would come from environment variables
const API_BASE_URL = '/api';

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
  return fetchWithErrorHandling(`${API_BASE_URL}/users/me`);
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
    body: JSON.stringify({ name, email, role }),
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
  receiverId: string,
  amount: number,
  description: string
): Promise<Transaction> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    body: JSON.stringify({ receiverId, amount, description }),
  });
};

// HELPER FUNCTIONS FOR TRANSITIONING FROM MOCK DATA
// These functions check if we should use the live API or fall back to mock data
// This allows for a gradual migration from mock to real data

// Check if we have a valid API connection
let isApiConnected: boolean | null = null;

export const checkApiConnection = async (): Promise<boolean> => {
  if (isApiConnected !== null) return isApiConnected;
  
  try {
    await fetch(`${API_BASE_URL}/health`);
    isApiConnected = true;
    return true;
  } catch (error) {
    console.warn('API connection failed, falling back to mock data');
    isApiConnected = false;
    return false;
  }
};

// Fallback to mock data implementations will be in a separate file
