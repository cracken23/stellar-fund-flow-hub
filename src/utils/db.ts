
import sql from 'mssql';

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

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect.catch(err => {
  console.error('SQL Connection Error:', err);
});

export const getConnection = async () => {
  try {
    return await poolConnect;
  } catch (error) {
    console.error('Failed to get SQL connection:', error);
    throw error;
  }
};

export const executeQuery = async (queryText: string, params: any[] = []) => {
  try {
    const conn = await getConnection();
    const request = new sql.Request(conn);
    
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
  executeQuery
};
