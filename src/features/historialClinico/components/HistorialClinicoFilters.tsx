function HistorialClinicoFilters({ filters, onFilterChange, onClearFilters }) {
  return (
    <div className="search-panel">
      <label className="form-field compact">
        <span>Mascota</span>
        <input
          type="text"
          value={filters.mascota || ""}
          placeholder="Buscar por mascota"
          onChange={(event) => onFilterChange("mascota", event.target.value)}
        />
      </label>

      <label className="form-field compact">
        <span>Diagnostico</span>
        <input
          type="text"
          value={filters.diagnostico || ""}
          placeholder="Buscar diagnostico"
          onChange={(event) => onFilterChange("diagnostico", event.target.value)}
        />
      </label>

      <label className="form-field compact">
        <span>Tratamiento</span>
        <input
          type="text"
          value={filters.tratamiento || ""}
          placeholder="Buscar tratamiento"
          onChange={(event) => onFilterChange("tratamiento", event.target.value)}
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

export default HistorialClinicoFilters;
