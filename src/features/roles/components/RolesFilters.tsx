function RolesFilters({ filters, onFilterChange, onClearFilters }) {
  return (
    <div className="search-panel">
      <label className="form-field compact">
        <span>Nombre</span>
        <input
          type="text"
          value={filters.nombre || ""}
          placeholder="Buscar rol"
          onChange={(event) => onFilterChange("nombre", event.target.value)}
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

export default RolesFilters;
