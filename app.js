import express from 'express';
import bodyParser from 'body-parser';
import indexRoute from './routes/index.js';
import searchRoute from './routes/search.js'
import donationRoute from './routes/donation.js'

const app = express();
const port = 3000;

app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 
app.use('/index',indexRoute);
app.use('/search',searchRoute);
app.use('/donation',donationRoute);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
