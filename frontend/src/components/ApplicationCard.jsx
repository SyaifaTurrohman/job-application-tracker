// Warna berbeda tiap status, dipakai via inline style karena nilainya dinamis
const statusColors = {
  APPLIED: 'var(--stamp-applied)',
  INTERVIEW: 'var(--stamp-interview)',
  OFFER: 'var(--stamp-offer)',
  REJECTED: 'var(--stamp-rejected)',
};

const statusLabels = {
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
};

import { useState } from 'react';
import NotesPanel from './NotesPanel.jsx';

// Komponen ini menerima props: application (data lamaran), onDelete, onStatusChange
function ApplicationCard({ application, onDelete, onStatusChange }) {
  const { id, company, position, status, jobUrl, appliedDate } = application;
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div className="app-card">
      <div className="app-card-header">
        <div>
          <p className="app-card-index">FILE No. {String(id).padStart(4, '0')}</p>
          <h3 className="app-card-company">{company}</h3>
          <p className="app-card-position">{position}</p>
        </div>
        <span className="stamp" style={{ color: statusColors[status] }}>
          {statusLabels[status]}
        </span>
      </div>

      <p className="app-card-meta">
        Applied — {new Date(appliedDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
      </p>

      {jobUrl && (
        <a href={jobUrl} target="_blank" rel="noopener noreferrer" className="app-card-link">
          View listing →
        </a>
      )}

      <div className="app-card-actions">
        {/* Dropdown untuk ganti status — memanggil onStatusChange yang dikirim dari parent */}
        <select
          value={status}
          onChange={(e) => onStatusChange(id, e.target.value)}
          className="status-select"
        >
          {Object.keys(statusLabels).map((key) => (
            <option key={key} value={key}>{statusLabels[key]}</option>
          ))}
        </select>

        <button onClick={() => onDelete(id)} className="delete-btn">
          Remove
        </button>
      </div>

      <button
        onClick={() => setNotesOpen((prev) => !prev)}
        className="notes-toggle-btn"
      >
        {notesOpen ? '− Hide notes' : '+ Notes & reminders'}
      </button>

      {notesOpen && <NotesPanel applicationId={id} />}
    </div>
  );
}

export default ApplicationCard;
