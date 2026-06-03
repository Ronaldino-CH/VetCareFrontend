import { Link } from "react-router-dom";
import { historialClinicoConfig } from "../../../config/modules";
import { useAuth } from "../../../hooks/useAuth";
import HistorialClinicoFilters from "./HistorialClinicoFilters";
import HistorialClinicoTable from "./HistorialClinicoTable";
import { useHistorialClinicoList } from "../hooks/useHistorialClinicoList";

function HistorialClinicoList() {
  const { roleId } = useAuth();
  const {
    historiales,
    mascotas,
    veterinarios,
    loading,
    error,
    page,
    take,
    meta,
    filters,
    setPage,
    setTake,
    updateFilter,
    clearFilters,
    reload
  } = useHistorialClinicoList();

  const canCreate = historialClinicoConfig.roleAccess.create.includes(roleId);
  const canViewDetail = historialClinicoConfig.roleAccess.list.includes(roleId);
  const canEdit = historialClinicoConfig.roleAccess.edit.includes(roleId);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Historial Clinico - Listado</h2>
        <div className="actions">
          <button className="secondary-btn" onClick={reload} disabled={loading}>
            Recargar
          </button>
          {canCreate ? (
            <Link className="primary-btn" to="/historial-clinico/crear">
              Crear
            </Link>
          ) : null}
        </div>
      </div>

      <HistorialClinicoFilters filters={filters} onFilterChange={updateFilter} onClearFilters={clearFilters} />

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <HistorialClinicoTable
            historiales={historiales}
            mascotas={mascotas}
            veterinarios={veterinarios}
            canViewDetail={canViewDetail}
            canEdit={canEdit}
          />

          <div className="pagination-row">
            <div>
              Total: <strong>{meta.totalCount || 0}</strong>
            </div>

            <div className="pagination-controls">
              <label>
                Por pagina
                <select value={take} onChange={(event) => setTake(Number(event.target.value))}>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </label>

              <button className="secondary-btn" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>
                Anterior
              </button>
              <span>
                Pagina {meta.currentPage || page} de {meta.totalPages || 1}
              </span>
              <button
                className="secondary-btn"
                onClick={() => setPage((meta.currentPage || page) + 1)}
                disabled={(meta.currentPage || page) >= (meta.totalPages || 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

export default HistorialClinicoList;
