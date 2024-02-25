// const fs = require('fs');
// const path = require('path');
// const db = require('./db');

// async function extractKeywordsFromArticle(article) {
//     const markdownContent = fs.readFileSync(path.join(__dirname, `${article}`), 'utf8');
//     const words = markdownContent.split(/\s+/);

//     // console.log(words); // Logs an array of words


//     const wordset = new Set(words);
//     //console.log(wordset);
//     return wordset
// }

// async function insertKeywords(keyword, article) {
//     const searchText = `INSERT INTO keywordsMatch (keyword, article)
//     VALUES ('${keyword}', ARRAY['${article}'])
//     ON CONFLICT (keyword) DO UPDATE
//     SET article = CASE
//                     WHEN '${article}' = ANY(keywordsMatch.article) THEN keywordsMatch.article
//                     ELSE array_append(keywordsMatch.article, '${article}')
//                   END`
    
//     const queryParams = [keyword, article];
//     try {
//         const { rows } = await db.query(searchText, queryParams);
//         return rows[0];
//     } catch (err) {
//         throw err;
//     }
// };

// // module.exports = insertUserData;

// articleFile = "article.md";
// keywordsSet = await extractKeywordsFromArticle(articleFile)
// for (const keyword of keywordsSet) { 
//     console.log(insertKeywords(keyword,articleFile))
// }

// Import the necessary modules
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { query } from './db.js';


// Set up the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to read and extract unique words from a Markdown file
async function extractKeywordsFromArticle(article) {
    const markdownContent = await fs.readFile(path.join(__dirname, article), 'utf8');
    const words = markdownContent.split(/\s+/);
    return new Set(words);
}

// Function to insert keywords into the PostgreSQL database
async function insertKeywords(keyword, article) {
    const searchText = `INSERT INTO keywordsMatch (keyword, article)
    VALUES ($1, ARRAY[$2])
    ON CONFLICT (keyword) DO UPDATE
    SET article = CASE
                    WHEN $2 = ANY(keywordsMatch.article) THEN keywordsMatch.article
                    ELSE array_append(keywordsMatch.article, $2)
                  END`;
    
    try {
        const { rows } = await pool.query(searchText, [keyword, article]);
        return rows[0];
    } catch (err) {
        throw err;
    }
};

// Main function to process the article file and insert keywords into the database
async function processKeywords(articleFile) {
    const keywordsSet = await extractKeywordsFromArticle(articleFile);
    const keywordInsertions = Array.from(keywordsSet).map(keyword =>
        insertKeywords(keyword, articleFile)
    );

    // Wait for all insertions to complete
    try {
        const results = await Promise.all(keywordInsertions);
        console.log(results);
    } catch (error) {
        console.error('Error inserting keywords:', error);
    }
}

// Run the process with a specified Markdown file
processKeywords("article.md");

