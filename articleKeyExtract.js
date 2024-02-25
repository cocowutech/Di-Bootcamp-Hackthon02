import fs from 'fs/promises';
import pool from './db.js';

const commonWords = new Set(['a', 'the', 'and', 'but', 'he', 'she', 'it', 'on', 'in', 'with', 'at', 'by', 'for', 'to', 'of', 'or', 'as', 'is']);

async function processAndStoreArticle(filePath, title) {
  try {
    const content = await fs.readFile(filePath, 'utf8'); // Read the Markdown content
    const keywords = extractKeywords(content); // Extract keywords

    // Make sure to include the filePath in the INSERT query
    const insertArticleQuery = 'INSERT INTO articles (title, file_path, content, keywords) VALUES ($1, $2, $3, $4) RETURNING id';
    const res = await pool.query(insertArticleQuery, [title, filePath, content, keywords.join(', ')]);
    console.log(`Article stored with ID: ${res.rows[0].id}`);
  } catch (error) {
    console.error(`Error processing article: ${error.message}`);
  }
}


function extractKeywords(content) {
    return [...new Set(content.toLowerCase().match(/\b\w+\b/g))]
      .filter(word => !commonWords.has(word) && word.length > 2);
  }


  // processAndStoreArticle('article01.md','Post-traumatic stress disorder (PTSD)');
  // processAndStoreArticle('public/markdown_files/article02.md','10 tips to boost your mental health');
  processAndStoreArticle('public/markdown_files/article03.md','Habitat’s Disaster Response');