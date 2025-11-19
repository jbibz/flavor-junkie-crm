// Simulate API delay
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

// localStorage key for notes
const NOTES_KEY = "flavor_junkie_notes";

export const notesService = {
  async getNotes() {
    await delay();
    const savedNotes = localStorage.getItem(NOTES_KEY);
    if (savedNotes) {
      return JSON.parse(savedNotes);
    }
    return {
      Id: 1,
      content: "",
      lastUpdated: null
    };
  },

  async saveNotes(content) {
    await delay();
    const notes = {
      Id: 1,
      content,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return notes;
  }
};