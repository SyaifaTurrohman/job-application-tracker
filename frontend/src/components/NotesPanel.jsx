import { useState, useEffect } from 'react';
import { getNotes, createNote, deleteNote } from '../api.js';
import { useToast } from '../context/ToastContext.jsx';

const typeLabels = {
  INTERVIEW_NOTE: 'Note',
  REMINDER: 'Reminder',
};

function NotesPanel({ applicationId }) {
  const showToast = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [type, setType] = useState('INTERVIEW_NOTE');
  const [reminderDate, setReminderDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Setiap NotesPanel fetch notes-nya sendiri, khusus untuk applicationId ini
  useEffect(() => {
    loadNotes();
  }, [applicationId]);

  async function loadNotes() {
    try {
      setLoading(true);
      const data = await getNotes(applicationId);
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNote(e) {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      const newNote = await createNote(applicationId, {
        content,
        type,
        reminderDate: type === 'REMINDER' && reminderDate ? reminderDate : undefined,
      });
      setNotes((prev) => [newNote, ...prev]);
      setContent('');
      setReminderDate('');
    } catch (err) {
      showToast('Gagal menambah note: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteNote(id) {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      showToast('Gagal menghapus note: ' + err.message, 'error');
    }
  }

  return (
    <div className="notes-panel">
      {loading ? (
        <p className="state-message" style={{ padding: '8px 0' }}>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="state-message" style={{ padding: '8px 0' }}>No notes attached yet.</p>
      ) : (
        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note.id} className={`note-item note-item--${note.type.toLowerCase()}`}>
              <div className="note-item-body">
                <span className="note-tag">{typeLabels[note.type]}</span>
                <p className="note-content">{note.content}</p>
                {note.reminderDate && (
                  <p className="note-reminder-date">
                    Follow up: {new Date(note.reminderDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="note-delete-btn"
                aria-label="Hapus note"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddNote} className="note-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a note or reminder..."
          className="note-textarea"
          rows={2}
        />
        <div className="note-form-row">
          <select value={type} onChange={(e) => setType(e.target.value)} className="note-type-select">
            <option value="INTERVIEW_NOTE">Note</option>
            <option value="REMINDER">Reminder</option>
          </select>

          {type === 'REMINDER' && (
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="note-date-input"
            />
          )}

          <button type="submit" disabled={submitting} className="note-add-btn">
            {submitting ? '...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NotesPanel;
