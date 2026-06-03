import { Link } from "react-router-dom";
import { estadoCitasConfig } from "../../../config/modules";
import { useAuth } from "../../../hooks/useAuth";
import EstadoCitasFilters from "./EstadoCitasFilters";
import EstadoCitasTable from "./EstadoCitasTable";
import { useEstadoCitasList } from "../hooks/useEstadoCitasList";

function EstadoCitasList() {
  const { roleId } = useAuth();
  const {
    estadoCitas,
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
  } = useEstadoCitasList();

  const canCreate = estadoCitasConfig.roleAccess.create.includes(roleId);
  const canViewDetail = estadoCitasConfig.roleAccess.list.includes(roleId);
  const canEdit = estadoCitasConfig.roleAccess.edit.includes(roleId);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Estado de Citas - Listado</h2>
        <div className="actions">
          <button className="secondary-btn" onClick={reload} disabled={loading}>
            Recargar
          </button>
          {canCreate ? (
            <Link className="primary-btn" to="/estado-citas/crear">
              Crear
            </Link>
          ) : null}
        </div>
      </div>

      <EstadoCitasFilters filters={filters} onFilterChange={updateFilter} onClearFilters={clearFilters} />

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <EstadoCitasTable estadoCitas={estadoCitas} canViewDetail={canViewDetail} canEdit={canEdit} />

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

export default EstadoCitasList;
