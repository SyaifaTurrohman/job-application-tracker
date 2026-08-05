const statusOrder = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];
const statusLabels = {
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
};

// Menerima daftar applications (belum difilter), hitung jumlah tiap status sendiri.
// Dipisah dari filter logic karena statistik harus tetap mencerminkan TOTAL,
// bukan cuma yang lagi ditampilkan setelah difilter.
function StatsBar({ applications }) {
  const counts = statusOrder.reduce((acc, status) => {
    acc[status] = applications.filter((a) => a.status === status).length;
    return acc;
  }, {});

  return (
    <div className="stats-bar">
      <div className="stats-total">
        <span className="stats-total-number">{applications.length}</span>
        <span className="stats-total-label">Total filed</span>
      </div>
      <div className="stats-tally">
        {statusOrder.map((status) => (
          <div key={status} className="stats-tally-item">
            <span className="stats-tally-number">{counts[status]}</span>
            <span className="stats-tally-label">{statusLabels[status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsBar;
