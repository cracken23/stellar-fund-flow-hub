
// Generate a random account number
export const generateRandomAccountNumber = (userCount?: number): string => {
  if (typeof userCount === 'number') {
    return `1000${(10000 + userCount).toString().slice(1)}`;
  }
  return `1000${Math.floor(Math.random() * 9000 + 1000)}`;
};

// Initialize mock data
export const initializeMockData = () => {
  // Initialize users
  if (!localStorage.getItem('bankEaseUsers')) {
    const users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
        accountNumber: '10000001',
        balance: 5000.00,
      },
      {
        id: '2',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        accountNumber: '10000002',
        balance: 10000.00,
      }
    ];
    localStorage.setItem('bankEaseUsers', JSON.stringify(users));
  }
  
  // Initialize transactions
  if (!localStorage.getItem('bankEaseTransactions')) {
    const users = JSON.parse(localStorage.getItem('bankEaseUsers') || '[]');
    const allTransactions: Record<string, Transaction[]> = {};
    
    users.forEach((user: any) => {
      allTransactions[user.id] = generateTransactions(user.id, 15);
    });
    
    localStorage.setItem('bankEaseTransactions', JSON.stringify(allTransactions));
  }
};
