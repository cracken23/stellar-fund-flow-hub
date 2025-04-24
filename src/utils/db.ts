
import sql from 'mssql';

// Configuration object based on environment variables
const config = {
  server: process.env.SQL_SERVER || '',
  database: process.env.SQL_DATABASE || '',
  user: process.env.SQL_USERNAME || '',
  password: process.env.SQL_PASSWORD || '',
  port: parseInt(process.env.SQL_PORT || '1433'),
  options: {
    encrypt: process.env.SQL_ENCRYPT === 'true', // For Azure SQL Database
    trustServerCertificate: false, // Change to true for local dev / self-signed certs
    enableArithAbort: true
  }
};

// Create connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Handle connection errors
poolConnect.catch(err => {
  console.error('SQL Connection Error:', err);
});

// Export connection functions
export const getConnection = async () => {
  try {
    return await poolConnect;
  } catch (error) {
    console.error('Failed to get SQL connection:', error);
    throw error;
  }
};

// Test database connection
export const testConnection = async () => {
  try {
    const conn = await getConnection();
    console.log('Successfully connected to Azure SQL Database');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

// Reusable query function with error handling
export const executeQuery = async (queryText: string, params: any[] = []) => {
  try {
    const conn = await getConnection();
    const request = new sql.Request(conn);
    
    // Add parameters if provided
    params.forEach((param, index) => {
      request.input(`param${index}`, param);
    });
    
    const result = await request.query(queryText);
    return result.recordset;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};

export default {
  getConnection,
  executeQuery,
  testConnection
};
