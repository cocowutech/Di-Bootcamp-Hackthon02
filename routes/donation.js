import express from 'express';
import { insertDonation}  from '../model.js';
import path from 'path';
import { fileURLToPath } from 'url';


const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDirectoryPath = path.join(__dirname, '../public');


router.get('/', (req, res) => {
    console.log(req.method)
    res.sendFile(path.join(publicDirectoryPath, 'donation.html'));
});

router.post('/', async (req,res)=> {
    const { name, email, amount } = req.body;
    try {
        const user = await insertDonation(name, email, amount);
        res.status(201).json({ message: "User's data saved successfully", user });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ message: 'Failed to save user data' });
    }

    // res.send(`Thank you ${name} for your $${amount} support!`)
})
export default router;