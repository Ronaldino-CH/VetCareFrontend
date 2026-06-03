function CitasFilters({ filters, estadoCitas, onFilterChange, onClearFilters }) {
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
        <span>Estado cita</span>
        <select value={filters.idEstadoCita || ""} onChange={(event) => onFilterChange("idEstadoCita", event.target.value)}>
          <option value="">Todos</option>
          {estadoCitas.map((estado) => (
            <option key={`estado-cita-${estado.value}`} value={estado.value}>
              {estado.label}
            </option>
          ))}
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

export default CitasFilters;
