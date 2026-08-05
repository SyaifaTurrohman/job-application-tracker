import { useState, useEffect } from 'react';
import { getApplications, deleteApplication, updateApplication } from '../api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';
import ApplicationCard from './ApplicationCard.jsx';
import ApplicationForm from './ApplicationForm.jsx';
import StatsBar from './StatsBar.jsx';
import FilterBar from './FilterBar.jsx';

function ApplicationList() {
  const showToast = useToast();
  const confirm = useConfirm();

  // State: data lamaran, status loading, dan pesan error
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk filter & search — terpisah dari data utama
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Fungsi buat ambil data dari API, dipisah biar bisa dipanggil ulang kapan aja
  async function loadApplications() {
    try {
      setLoading(true);
      const data = await getApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // useEffect dengan dependency array kosong [] artinya:
  // jalankan HANYA SEKALI saat komponen pertama kali muncul (mounting)
  useEffect(() => {
    loadApplications();
  }, []);

  async function handleDelete(id) {
    // confirm() di sini adalah custom hook kita, bukan window.confirm() bawaan browser.
    // Sama-sama bisa di-`await`, tapi tampilannya custom & konsisten dengan tema.
    const ok = await confirm('Yakin mau hapus lamaran ini? Notes yang terkait juga akan terhapus.');
    if (!ok) return;

    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      showToast('Lamaran berhasil dihapus.', 'success');
    } catch (err) {
      showToast('Gagal menghapus: ' + err.message, 'error');
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const updated = await updateApplication(id, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updated : app))
      );
      showToast('Status diperbarui.', 'success');
    } catch (err) {
      showToast('Gagal update status: ' + err.message, 'error');
    }
  }

  // Dipanggil dari ApplicationForm setelah berhasil bikin data baru
  function handleCreated(newApp) {
    setApplications((prev) => [newApp, ...prev]);
    showToast('Lamaran baru berhasil disimpan.', 'success');
  }

  // Derived state: dihitung ulang tiap render dari applications + search + statusFilter.
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <p className="state-message">Loading archive...</p>;
  if (error) return <p className="state-message error">Error: {error}</p>;

  return (
    <div>
      <ApplicationForm onCreated={handleCreated} />
      <hr className="divider" />

      {applications.length > 0 && (
        <>
          <StatsBar applications={applications} />
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </>
      )}

      {applications.length === 0 ? (
        <p className="state-message">No entries filed yet. Add your first lead above.</p>
      ) : filteredApplications.length === 0 ? (
        <p className="state-message">No entries match this search or filter.</p>
      ) : (
        filteredApplications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))
      )}
    </div>
  );
}

export default ApplicationList;
