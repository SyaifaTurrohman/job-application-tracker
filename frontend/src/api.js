const API_URL = 'http://localhost:5000/api';

// Ambil semua applications
export async function getApplications() {
  const res = await fetch(`${API_URL}/applications`);
  if (!res.ok) throw new Error('Gagal mengambil data applications');
  return res.json();
}

// Ambil satu application beserta notes-nya
export async function getApplication(id) {
  const res = await fetch(`${API_URL}/applications/${id}`);
  if (!res.ok) throw new Error('Gagal mengambil data application');
  return res.json();
}

// Tambah application baru
export async function createApplication(data) {
  const res = await fetch(`${API_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal membuat application');
  return res.json();
}

// Update application (misalnya ganti status)
export async function updateApplication(id, data) {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal update application');
  return res.json();
}

// Hapus application
export async function deleteApplication(id) {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Gagal menghapus application');
}

// --- Notes (interview notes & reminder) ---

// Ambil semua notes milik satu application
export async function getNotes(applicationId) {
  const res = await fetch(`${API_URL}/applications/${applicationId}/notes`);
  if (!res.ok) throw new Error('Gagal mengambil data notes');
  return res.json();
}

// Tambah note baru ke satu application
export async function createNote(applicationId, data) {
  const res = await fetch(`${API_URL}/applications/${applicationId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal membuat note');
  return res.json();
}

// Hapus note
export async function deleteNote(id) {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Gagal menghapus note');
}
