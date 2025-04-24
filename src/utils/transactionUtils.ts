
import { Transaction } from '../types/banking';
import { executeQuery } from './db';
import { v4 as uuidv4 } from 'uuid';

export const getTransactionsByUserId = async (userId: string): Promise<Transaction[]> => {
  const transactions = await executeQuery(
    `SELECT id, amount, type, description, fromAccount, toAccount, timestamp, status
     FROM Transactions
     WHERE senderId = @param0 OR receiverId = @param0
     ORDER BY timestamp DESC`,
    [userId]
  );
  return transactions;
};

export const createTransaction = async (
  senderId: string,
  receiverId: string,
  amount: number,
  description: string
): Promise<Transaction> => {
  const [sender, receiver] = await Promise.all([
    executeQuery('SELECT accountNumber FROM Users WHERE id = @param0', [senderId]),
    executeQuery('SELECT accountNumber FROM Users WHERE id = @param0', [receiverId])
  ]);

  const result = await executeQuery(
    `INSERT INTO Transactions (id, senderId, receiverId, amount, description, fromAccount, toAccount, timestamp, status, type)
     OUTPUT INSERTED.*
     VALUES (@param0, @param1, @param2, @param3, @param4, @param5, @param6, @param7, @param8, @param9)`,
    [
      uuidv4(),
      senderId,
      receiverId,
      amount,
      description,
      sender[0].accountNumber,
      receiver[0].accountNumber,
      new Date(),
      'completed',
      'debit'
    ]
  );

  // Update balances
  await Promise.all([
    executeQuery(
      'UPDATE Users SET balance = balance - @param1 WHERE id = @param0',
      [senderId, amount]
    ),
    executeQuery(
      'UPDATE Users SET balance = balance + @param1 WHERE id = @param0',
      [receiverId, amount]
    )
  ]);

  return result[0];
};
