require('dotenv').config();

const express = require('express')
const app = express();
const cors = require('cors');
const db = require('./db');


app.use(cors());

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidates', candidateRoutes);


app.listen(PORT, ()=>{
    console.log('listening on port 3000');
})