import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDirectoryPath = path.join(__dirname, '../public');

router.get('/', (req, res) => {
    console.log(req.method);
    const keyword = req.query;
    console.log(keyword);
    res.sendFile(path.join(publicDirectoryPath, 'search.html'));
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    try {
        const articles = articleSearch(keyword);
        if (articles.length > 0) {
            // You might want to return multiple articles or just the most relevant one
            // For simplicity, this example returns the first matching article
            const article = articles[0];
            const filePath = path.join(process.cwd(), 'public/markdown_files', article.file_path);
            const content = fs.readFile(filePath, 'utf8');
            res.json({ title: article.title, content });
        } else {
            res.status(404).json({ message: 'No matching articles found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;