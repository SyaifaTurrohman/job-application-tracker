const statusOrder = ['ALL', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];
const statusLabels = {
  ALL: 'All',
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
};

// Controlled component sepenuhnya: semua state (search, filter) dikelola parent (ApplicationList),
// FilterBar cuma nampilin UI dan lapor perubahan lewat callback.
function FilterBar({ search, onSearchChange, statusFilter, onStatusFilterChange }) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by company or position..."
        className="search-input"
      />

      <div className="filter-tabs">
        {statusOrder.map((status) => (
          <button
            key={status}
            onClick={() => onStatusFilterChange(status)}
            className={`filter-tab ${statusFilter === status ? 'filter-tab--active' : ''}`}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
