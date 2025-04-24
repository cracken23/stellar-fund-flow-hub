
export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  fromAccount?: string;
  toAccount?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  accountNumber: string;
  balance: number;
}
