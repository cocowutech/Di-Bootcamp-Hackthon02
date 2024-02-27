import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'
import {deleteNote, insertNote, updateNote, getNotes} from '../model.js'

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/note', (req,res)=>{
    getNotes()
    .then(data=>{
        res.status(200).json(data)
    })
    .catch((error)=>{
        res.status(500).json(error)
    })
})
router.post('/note',(req,res)=>{
    let {content} = req.body
    insertNote(content)
    .then(data=>{
        res.status(201).json(data)
    })
    .catch((error)=>{
        res.status(500).json(error)
    })
})
router.delete('/note/:id',(req,res)=>{
    const { id } = req.params; // Extract the note ID from the URL
    deleteNote(id)
    .then(() => {
        res.status(204).send(); // No content, but successful operation
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    });
})
router.patch('/note/:id',(req,res)=>{
    let content = req.body
    updateNote(id,content)
    .then(data=>{
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).send('Note not found');
        }
    })
    .catch((error)=>{
        res.status(500).json(error)
    })
})



export default router;