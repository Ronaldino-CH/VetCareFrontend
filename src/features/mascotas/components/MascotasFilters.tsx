function MascotasFilters({ filters, onFilterChange, onClearFilters }) {
  return (
    <div className="search-panel">
      <label className="form-field compact">
        <span>Nombre</span>
        <input
          type="text"
          value={filters.nombres || ""}
          placeholder="Buscar por nombre"
          onChange={(event) => onFilterChange("nombres", event.target.value)}
        />
      </label>

      <label className="form-field compact">
        <span>Estado</span>
        <select value={filters.estadoMascota || ""} onChange={(event) => onFilterChange("estadoMascota", event.target.value)}>
          <option value="">Todos</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </label>

      <div className="search-actions">
        <button className="secondary-btn" onClick={onClearFilters}>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

export default MascotasFilters;
