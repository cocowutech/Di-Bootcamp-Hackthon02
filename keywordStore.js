import pool from './db.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';



// Set up the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to read and extract unique words from a Markdown file
async function extractKeywordsFromArticle(article) {
    const markdownContent = await fs.readFile(path.join(__dirname, article), 'utf8');
    const words = markdownContent.split(/\s+/);
    return new Set(words);
}

// Function to insert keywords into the PostgreSQL database
async function insertArticleTitle(keyword, articleTitle) {

    const queryText = `SELECT insert_article_title($1, $2);`;
    
    console.log(keyword);
    try {
        const { rows } = await pool.query(queryText, [keyword, articleTitle]);
        return rows[0];
    } catch (err) {
        throw err;
    }
};

// Main function to process the article file and insert keywords into the database
async function processKeywords(articleFile) {
    const keywordsSet = await extractKeywordsFromArticle(articleFile);
    const keywordInsertions = Array.from(keywordsSet).map(keyword =>
        insertArticleTitle(keyword, articleFile)
    );

    // Wait for all insertions to complete
    try {
        const results = await Promise.all(keywordInsertions);
        console.log(results);
        console.log('finished');
    } catch (error) {
        console.error('Error inserting keywords:', error);
    }
}

processKeywords('public/markdown_files/article01.md')