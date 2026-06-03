import { Link } from "react-router-dom";
import { clientesConfig } from "../../../config/modules";
import { useAuth } from "../../../hooks/useAuth";
import ClientesFilters from "./ClientesFilters";
import ClientesTable from "./ClientesTable";
import { useClientesList } from "../hooks/useClientesList";

function ClientesList() {
  const { roleId } = useAuth();
  const {
    clientes,
    loading,
    error,
    page,
    take,
    meta,
    filters,
    toggleLoading,
    setPage,
    setTake,
    updateFilter,
    clearFilters,
    reload,
    toggleClienteStatus
  } = useClientesList();

  const canCreate = clientesConfig.roleAccess.create.includes(roleId);
  const canEdit = clientesConfig.roleAccess.edit.includes(roleId);
  const canToggle = clientesConfig.roleAccess.toggle.includes(roleId);
  const canViewDetail = clientesConfig.roleAccess.list.includes(roleId);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Clientes - Listado</h2>
        <div className="actions">
          <button className="secondary-btn" onClick={reload} disabled={loading || toggleLoading}>
            Recargar
          </button>
          {canCreate ? (
            <Link className="primary-btn" to="/clientes/crear">
              Crear
            </Link>
          ) : null}
        </div>
      </div>

      <ClientesFilters filters={filters} onFilterChange={updateFilter} onClearFilters={clearFilters} />

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <ClientesTable
            clientes={clientes}
            canViewDetail={canViewDetail}
            canEdit={canEdit}
            canToggle={canToggle}
            onToggleStatus={toggleClienteStatus}
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

export default ClientesList;
