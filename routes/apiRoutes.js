const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../db/db.json');

// Helper function to read data from JSON file
const readData = (callback) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      callback(JSON.parse(data));
    }
  });
};

// Helper function to write data to JSON file
const writeData = (data, callback) => {
  fs.writeFile(dbPath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error(err);
      callback(false);
    } else {
      callback(true);
    }
  });
};

// GET /api/notes should read the db.json file and return all saved notes as JSON.
router.get('/notes', (req, res) => {
  readData((notes) => {
    res.json(notes);
  });
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and return the new note to the client.
router.post('/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = { id: uuidv4(), title, text };
    readData((notes) => {
      notes.push(newNote);
      writeData(notes, (success) => {
        if (success) {
          res.json(newNote);
        } else {
          res.status(500).json({ error: 'Failed to save note' });
        }
      });
    });
  } else {
    res.status(400).json({ error: 'Note title and text are required' });
  }
});

// DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete.
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readData((notes) => {
    const filteredNotes = notes.filter(note => note.id !== noteId);
    writeData(filteredNotes, (success) => {
      if (success) {
        res.json({ message: 'Note deleted successfully' });
      } else {
        res.status(500).json({ error: 'Failed to delete note' });
      }
    });
  });
});

module.exports = router;
