import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { searchArticles } from '../model.js';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
    console.log(req.method);
    res.sendFile(path.join(__dirname, '../public/search.html'));
})

router.get('/query',async(req,res) => {
    const { keyword } = req.query;
    // 相当于 const keyword  = req.query.keyword;

    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    try {
        const articles = await searchArticles(keyword);
        console.log(articles)

        if (articles.length > 0) {
            // You might want to return multiple articles or just the most relevant one
            // For simplicity, this example returns the first matching article
            const article = articles[0];
            const filePath = path.join(process.cwd(), 'public/markdown_files', article.file_path);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                  console.error(err);
                  res.status(404).json({ message:err});
                }
                res.json({ title: article.title, data});
            });
            
        } else {
            res.status(404).json({ message: 'No matching articles found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})
    

export default router;