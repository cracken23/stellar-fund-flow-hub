
// Helper functions for the banking API

/**
 * Generate a random account number
 * @returns {string} A random account number
 */
const generateRandomAccountNumber = () => {
  return `1000${Math.floor(Math.random() * 9000 + 1000)}`;
};

module.exports = {
  generateRandomAccountNumber
};
