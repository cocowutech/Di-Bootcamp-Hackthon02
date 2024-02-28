import pool from './db.js'; 

async function insertDonation(username, email, donationAmount){
  const query = 'INSERT INTO donations(username, email, donation_amount) VALUES($1,$2,$3) RETURNING *';
  const values = [username, email, donationAmount];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};


async function deleteNote(id){
  const query = 'DELETE FROM notes WHERE id=$1 RETURNING *';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

async function insertNote(content){
  const query = 'INSERT INTO notes (note) VALUES($1) RETURNING *';
  const values = [content];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// insertNote("Hihihi")

async function updateNote(id,content){
  const query = 'UPDATE notes SET note =$2 WHERE id=$1 RETURNING *';
  const values = [id,content];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// insertNote('I am coming');

async function getNotes(){
  try {
    const query = `
      SELECT * FROM notes;`;
    const { rows } = await pool.query(query);
    return rows; // Return all matching articles
  } catch (err) {
    console.error('Database query error:', err);
    throw err; // Rethrow the error to handle it in the calling function
  }
};


async function searchArticles(searchQuery) {
  // Split the search query into individual words
  const searchTerms = searchQuery.split(/\s+/).filter(term => term.length > 0);

  // Create an array of ILIKE patterns for each search term
  const likePatterns = searchTerms.map(term => `%${term}%`);

  try {
    const query = `
      SELECT * FROM articles
      WHERE keywords ILIKE ANY($1)
      LIMIT 1;`;
    const values = [likePatterns];
    const { rows } = await pool.query(query, values);
    return rows; // Return all matching articles
  } catch (err) {
    console.error('Database query error:', err);
    throw err; // Rethrow the error to handle it in the calling function
  }
}


export {insertDonation, searchArticles, deleteNote, insertNote, updateNote, getNotes};

