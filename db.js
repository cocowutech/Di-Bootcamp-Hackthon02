import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'hackathon', 
    password: '111111', // Your database password
    port: 5433, // Default port for PostgreSQL
});

export default pool;


pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack);
    }
    console.log('Database connection successful');
    client.query('SELECT NOW()', (err, result) => {
      release();
      if (err) {
        return console.error('Error executing query', err.stack);
      }
      console.log(result.rows); // Should show the current time
    });
  });

