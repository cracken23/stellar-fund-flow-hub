
require('dotenv').config();
const sql = require('mssql');

// Configuration object based on environment variables
const config = {
  server: process.env.SQL_SERVER || '',
  database: process.env.SQL_DATABASE || '',
  user: process.env.SQL_USERNAME || '',
  password: process.env.SQL_PASSWORD || '',
  port: parseInt(process.env.SQL_PORT || '1433'),
  options: {
    encrypt: process.env.SQL_ENCRYPT === 'true',
    trustServerCertificate: false,
    enableArithAbort: true
  }
};

// Create connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Handle connection errors
poolConnect.catch((err) => {
  console.error('SQL Connection Error:', err);
});

// Export database functions
module.exports = {
  getConnection: async () => {
    try {
      return await poolConnect;
    } catch (error) {
      console.error('Failed to get SQL connection:', error);
      throw error;
    }
  },
  
  executeQuery: async (queryText, params = []) => {
    try {
      const conn = await module.exports.getConnection();
      const request = new sql.Request(conn);
      
      // Add parameters to the request
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });
      
      const result = await request.query(queryText);
      return result.recordset;
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  },

  // Test connection
  testConnection: async () => {
    try {
      await module.exports.getConnection();
      return true;
    } catch (error) {
      console.error('Test connection failed:', error);
      return false;
    }
  }
};
