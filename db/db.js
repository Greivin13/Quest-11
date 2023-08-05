const fs = require('fs').promises; 
const { v1: uuidv1 } = require('uuid'); 

// Read data from 'db.json' file
// Parse the data as JSON or return an empty array if it's invalid or empty
class Store {
  async read() {
    try {
      const data = await fs.readFile('db/db.json', 'utf8'); 
      return JSON.parse(data) || []; 
    } catch (err) {
      return []; 
    }
  }

  async write(note) {
    return fs.writeFile('db/db.json', JSON.stringify(note)); 
  }

  async getNotes() {
    const notes = await this.read(); 
    return notes; 
  }

  async addNote(note) {
    const { title, text } = note; 

    if (!title || !text) {
      throw new Error("Note 'title' and 'text' cannot be blank"); 
    }
    // Create a new note object with a unique id using uuidv1()
    const newNote = { title, text, id: uuidv1() }; 
    const notes = await this.getNotes(); 

    const updatedNotes = [...notes, newNote]; 
    await this.write(updatedNotes); 

    return newNote; // Return the newly added note
  }

  async removeNote(id) {
    const notes = await this.getNotes(); // Get the existing notes from the file
    const filteredNotes = notes.filter((note) => note.id !== id); // Remove the note with the given id

    await this.write(filteredNotes); // Write the filtered notes back to the file
  }
}

module.exports = new Store(); // Export an instance of the Store class to be used as a singleton
