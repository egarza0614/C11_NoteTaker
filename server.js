const express = require('express');
const path = require('path');
const fsUtils = require('./helpers/fsUtils.js'); // Import fsUtils
const noteRoute = require('./routes/note');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

app.use(express.json());  // Parse JSON request bodies

// Serve static files from the public directory
app.use(express.static('public'));
// Mount the note router under /api/notes
app.use('/api/notes', noteRoute); 

// Route to serve notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Route to serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Start the server
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
