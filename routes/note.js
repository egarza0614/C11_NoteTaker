const note = require('express').Router();
const { readAndAppend } = require('../helpers/fsUtils');
const { readFromFile } = require('../helpers/fsUtils');

// GET route to get all notes
note.get('/', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
  );
  
// POST route to save a new note
note.post('/', (req, res) => {
const {title, text} = req.body;
if (title && text) {
    const newNote = {
    title,
    text,
    };

    readAndAppend(newNote, './db/db.json');
    
    const response = {
    status: 'success',
    body: newNote,
    };

    res.json(response);
    } else {
    res.json('Error in posting note');
    }
});

module.exports = note;
