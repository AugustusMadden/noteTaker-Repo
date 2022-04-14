const express = require('express');
const path = require('path');
const fs = require('fs');

const noteData = require('./db/db.json')
const randID = require('./helpers/randID')
const PORT = 3001;

const app = express();

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

/* * `GET *` should return the `index.html` file. */
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

/* `GET /notes` should return the `notes.html` file. */
app.get('/notes', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

/* * `GET /api/notes` should read the `db.json` file and return all saved notes as JSON. */
app.get('/api/notes', (req,res) =>
    res.status(200).json(noteData)
);

/* * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you). */
app.post('/api/notes', (req,res) => {
    console.info(`${req.method} request received to add a new note`);

    const {title,text} = req.body;

    if (title && text) {
        // Variable for the new note save
        const newNote = {
            title,
            text,
            note_id: randID(),
        };

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.log(err)
            } else {
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Note added.')
                );
            }
        })
        
        const response = {
            status: 'sucess',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response)
    } else {
        res.status(500).json('An error was encountered when adding your note')
    }
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});


/* GIVEN a note-taking application
WHEN I open the Note Taker
THEN I am presented with a landing page with a link to a notes page
WHEN I click on the link to the notes page
THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
WHEN I enter a new note title and the note’s text
THEN a Save icon appears in the navigation at the top of the page
WHEN I click on the Save icon
THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
WHEN I click on an existing note in the list in the left-hand column
THEN that note appears in the right-hand column
WHEN I click on the Write icon in the navigation at the top of the page
THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column */