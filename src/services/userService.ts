
import { executeQuery } from '../utils/db';
import { User } from '../utils/mockData';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const users = await executeQuery(
      `SELECT id, name, email, role, accountNumber, balance 
       FROM Users 
       WHERE email = @param0`, 
      [email]
    );
    
    return users.length > 0 ? users[0] as User : null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const users = await executeQuery(
      `SELECT id, name, email, role, accountNumber, balance 
       FROM Users 
       WHERE id = @param0`, 
      [id]
    );
    
    return users.length > 0 ? users[0] as User : null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await executeQuery(
      `SELECT id, name, email, role, accountNumber, balance 
       FROM Users`
    );
    
    return users as User[];
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const createUser = async (user: Omit<User, 'id'> & { password: string }): Promise<User> => {
  try {
    // In a production environment, password should be hashed before storing
    const result = await executeQuery(
      `INSERT INTO Users (name, email, password, role, accountNumber, balance)
       OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role, INSERTED.accountNumber, INSERTED.balance
       VALUES (@param0, @param1, @param2, @param3, @param4, @param5)`,
      [user.name, user.email, user.password, user.role, user.accountNumber, user.balance]
    );
    
    return result[0] as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUserBalance = async (userId: string, newBalance: number): Promise<boolean> => {
  try {
    const result = await executeQuery(
      `UPDATE Users 
       SET balance = @param1 
       WHERE id = @param0`,
      [userId, newBalance]
    );
    
    return true;
  } catch (error) {
    console.error('Error updating user balance:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await executeQuery(
      `DELETE FROM Users WHERE id = @param0`,
      [userId]
    );
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    // In a production environment, password comparison should be done securely
    const users = await executeQuery(
      `SELECT id, name, email, role, accountNumber, balance 
       FROM Users 
       WHERE email = @param0 AND password = @param1`, 
      [email, password]
    );
    
    return users.length > 0 ? users[0] as User : null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};
