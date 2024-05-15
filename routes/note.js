const note = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// Helper function to check and update existing notes with IDs
async function updateExistingNotesWithIds() {
  try {
    let notesData = await readFromFile('./db/db.json');
    notesData = JSON.parse(notesData);

    const needsUpdate = notesData.some(note => !note.id);

    if (needsUpdate) {
      // Update existing notes with IDs
      const updatedNotes = notesData.map(note => {
        return note.id ? note : { ...note, id: uuidv4() };
      });

      // Write updated data back to db.json
      await writeToFile('./db/db.json', updatedNotes);
    }
  } catch (err) {
    console.error('Error updating existing notes with IDs:', err);
  }
}

// GET Route for retrieving all the notes
note.get('/', async (req, res) => {
  try {
    await updateExistingNotesWithIds(); // Call helper function to ensure IDs
    const data = await readFromFile('./db/db.json');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch notes' });
  }
});

// POST Route for a new note
note.post('/', async (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      id: uuidv4(), // Generate unique ID
      title,
      text,
    };

    await updateExistingNotesWithIds(); // Ensure IDs before appending
    readAndAppend(newNote, './db/db.json');

    res.json(newNote);
  } else {
    res.status(400).json({ error: 'Title and text are required' });
  }
});

// DELETE Route for deleting a note by ID
note.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      writeToFile('./db/db.json', result);

      res.json(`Item ${noteId} has been deleted 🗑️`);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Unable to delete note' });
    });
});

module.exports = note;
