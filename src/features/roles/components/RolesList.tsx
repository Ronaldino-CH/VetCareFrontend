import { Link } from "react-router-dom";
import { rolesConfig } from "../../../config/modules";
import { useAuth } from "../../../hooks/useAuth";
import RolesFilters from "./RolesFilters";
import RolesTable from "./RolesTable";
import { useRolesList } from "../hooks/useRolesList";

function RolesList() {
  const { roleId } = useAuth();
  const {
    roles,
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
  } = useRolesList();

  const canCreate = rolesConfig.roleAccess.create.includes(roleId);
  const canViewDetail = rolesConfig.roleAccess.list.includes(roleId);
  const canEdit = rolesConfig.roleAccess.edit.includes(roleId);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Roles - Listado</h2>
        <div className="actions">
          <button className="secondary-btn" onClick={reload} disabled={loading}>
            Recargar
          </button>
          {canCreate ? (
            <Link className="primary-btn" to="/roles/crear">
              Crear
            </Link>
          ) : null}
        </div>
      </div>

      <RolesFilters filters={filters} onFilterChange={updateFilter} onClearFilters={clearFilters} />

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <RolesTable roles={roles} canViewDetail={canViewDetail} canEdit={canEdit} />

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

export default RolesList;
