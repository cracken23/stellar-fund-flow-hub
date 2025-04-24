
export const generateRandomAccountNumber = (): string => {
  return `1000${Math.floor(Math.random() * 9000 + 1000)}`;
};
