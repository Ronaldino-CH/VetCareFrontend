import { Link } from "react-router-dom";
import { citasConfig } from "../../../config/modules";
import { useAuth } from "../../../hooks/useAuth";
import CitasFilters from "./CitasFilters";
import CitasTable from "./CitasTable";
import { useCitasList } from "../hooks/useCitasList";

function CitasList() {
  const { roleId } = useAuth();
  const {
    citas,
    mascotas,
    veterinarios,
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
  } = useCitasList();

  const canCreate = citasConfig.roleAccess.create.includes(roleId);
  const canViewDetail = citasConfig.roleAccess.list.includes(roleId);
  const canEdit = citasConfig.roleAccess.edit.includes(roleId);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Citas - Listado</h2>
        <div className="actions">
          <button className="secondary-btn" onClick={reload} disabled={loading}>
            Recargar
          </button>
          {canCreate ? (
            <Link className="primary-btn" to="/citas/crear">
              Crear
            </Link>
          ) : null}
        </div>
      </div>

      <CitasFilters filters={filters} estadoCitas={estadoCitas} onFilterChange={updateFilter} onClearFilters={clearFilters} />

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <CitasTable
            citas={citas}
            mascotas={mascotas}
            veterinarios={veterinarios}
            estadoCitas={estadoCitas}
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

export default CitasList;
