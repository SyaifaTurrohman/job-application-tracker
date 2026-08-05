import { useState } from 'react';
import { createApplication } from '../api.js';
import { useToast } from '../context/ToastContext.jsx';

function ApplicationForm({ onCreated }) {
  const showToast = useToast();

  // Satu object state buat nampung semua field form,
  // daripada bikin useState terpisah untuk tiap input
  const [form, setForm] = useState({
    company: '',
    position: '',
    jobUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Handler generik: dipakai untuk semua input, membedakan field lewat "name"
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault(); // mencegah browser reload halaman saat submit form

    if (!form.company || !form.position) {
      showToast('Company dan Position wajib diisi.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const newApp = await createApplication(form);
      onCreated(newApp); // kabari parent (ApplicationList) ada data baru
      setForm({ company: '', position: '', jobUrl: '' }); // reset form
    } catch (err) {
      showToast('Gagal menambah lamaran: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <p className="form-title">New entry</p>

      <div className="field">
        <label className="field-label" htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          placeholder="e.g. Google"
          value={form.company}
          onChange={handleChange}
          className="text-input"
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="position">Position</label>
        <input
          id="position"
          name="position"
          placeholder="e.g. Frontend Developer"
          value={form.position}
          onChange={handleChange}
          className="text-input"
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="jobUrl">Listing URL (optional)</label>
        <input
          id="jobUrl"
          name="jobUrl"
          placeholder="https://..."
          value={form.jobUrl}
          onChange={handleChange}
          className="text-input"
        />
      </div>

      <button type="submit" disabled={submitting} className="submit-btn">
        {submitting ? 'Filing...' : 'File application'}
      </button>
    </form>
  );
}

export default ApplicationForm;
