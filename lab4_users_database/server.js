// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Replace your connection string here
const DB_HOST = 'cluster0.lmdpixg.mongodb.net';
const DB_USER = 'admin';
const DB_PASSWORD = 'Z3YkAPgIrTdJUIxO';
const DB_NAME = 'lab4';
const DB_CONNECTION_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

// Connect to MongoDB Atlas
mongoose.connect(DB_CONNECTION_STRING)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(error => console.error('Error connecting to MongoDB Atlas:', error));


// Create user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 4
    },
    email: {
        type: String,
        required: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    city: {
        type: String,
        required: true,
        match: /^[a-zA-Z\s]*$/,
    },
    website: {
        type: String,
        required: true,
        match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
    },
    zipCode: {
        type: String,
        required: true,
        match: /^\d{5}-\d{4}$/,
    },
    phone: {
        type: String,
        required: true,
        match: /^1-\d{3}-\d{3}-\d{4}$/,
    }
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// Load data from UserData.json
const userData = JSON.parse(fs.readFileSync('UsersData.json', 'utf8'));

// POST endpoint to insert user data
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Insert data from UserData.json
app.post('/insertTestData', async (req, res) => {
    try {
        await User.insertMany(userData);
        res.status(201).send('Test data inserted successfully');
    } catch (err) {
        res.status(400).send(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
