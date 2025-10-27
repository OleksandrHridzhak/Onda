import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Plus, Trash2 } from 'lucide-react';

// Initial notes data with content
const initialNotes = [
  { id: 1, title: 'Meeting Notes 2024-10-27', content: '### Agenda\n\n- Discuss project milestones\n- Review Q3 performance\n- Plan for next sprint' },
  { id: 2, title: 'Project Ideas', content: '- **Idea 1:** A new mobile app for task management\n- **Idea 2:** A web-based tool for collaborative writing' },
  { id: 3, title: 'Personal Reflection', content: '> "The unexamined life is not worth living." - Socrates' },
];

const Notes = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [editorValue, setEditorValue] = useState(notes[0]?.content || '');

  useEffect(() => {
    // Load the selected note's content into the editor
    setEditorValue(selectedNote?.content || '');
  }, [selectedNote]);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
    // Update the content of the selected note in the notes array
    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id ? { ...note, content: value } : note
    );
    setNotes(updatedNotes);
  };

  const handleNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: `New Note ${notes.length + 1}`,
      content: '',
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    if (selectedNote?.id === noteId) {
      setSelectedNote(updatedNotes[0] || null);
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* File List Sidebar */}
      <div className="w-1/4 border-r border-border p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primaryColor">My Notes</h2>
          <button
            onClick={handleNewNote}
            className="p-2 rounded-md hover:bg-gray-700"
            title="Create a new note"
          >
            <Plus size={20} />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {notes.map((note) => (
            <li
              key={note.id}
              className={`p-2 rounded-md cursor-pointer mb-2 flex justify-between items-center ${
                selectedNote?.id === note.id
                  ? 'bg-primaryColor text-white'
                  : 'hover:bg-gray-700'
              }`}
              onClick={() => handleNoteSelect(note)}
            >
              <span>{note.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the note from being selected
                  handleDeleteNote(note.id);
                }}
                className="p-1 rounded-md hover:bg-red-500"
                title="Delete note"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Markdown Editor */}
      <div className="flex-1 p-4" data-color-mode="dark">
         <MDEditor
          height="100%"
          value={editorValue}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default Notes;
