
import { User } from '../types/banking';
import { executeQuery } from './db';
import { v4 as uuidv4 } from 'uuid';

export const getAllUsers = async (): Promise<User[]> => {
  const users = await executeQuery(
    'SELECT id, name, email, role, accountNumber, balance FROM Users'
  );
  return users;
};

export const addUser = async (name: string, email: string, role: 'user' | 'admin'): Promise<User> => {
  const accountNumber = `1000${Math.floor(Math.random() * 9000 + 1000)}`;
  
  const result = await executeQuery(
    `INSERT INTO Users (id, name, email, role, accountNumber, balance)
     OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role, INSERTED.accountNumber, INSERTED.balance
     VALUES (@param0, @param1, @param2, @param3, @param4, @param5)`,
    [uuidv4(), name, email, role, accountNumber, 1000.00]
  );
  
  return result[0];
};

export const removeUser = async (userId: string): Promise<void> => {
  await executeQuery('DELETE FROM Users WHERE id = @param0', [userId]);
};
