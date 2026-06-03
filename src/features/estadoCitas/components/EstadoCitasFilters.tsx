function EstadoCitasFilters({ filters, onFilterChange, onClearFilters }) {
  return (
    <div className="search-panel">
      <label className="form-field compact">
        <span>Nombre</span>
        <input
          type="text"
          value={filters.nombreEstado || ""}
          placeholder="Buscar por nombre"
          onChange={(event) => onFilterChange("nombreEstado", event.target.value)}
        />
      </label>

      <div className="search-actions">
        <button className="secondary-btn" onClick={onClearFilters}>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

export default EstadoCitasFilters;
