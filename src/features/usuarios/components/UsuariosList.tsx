import { Link } from "react-router-dom";
import { usuariosConfig } from "../../../config/modules";
import { useAuth } from "../../../hooks/useAuth";
import UsuariosFilters from "./UsuariosFilters";
import UsuariosTable from "./UsuariosTable";
import { useUsuariosList } from "../hooks/useUsuariosList";

function UsuariosList() {
  const { roleId } = useAuth();
  const {
    usuarios,
    roles,
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
    toggleUsuarioStatus
  } = useUsuariosList();

  const canCreate = usuariosConfig.roleAccess.create.includes(roleId);
  const canViewDetail = usuariosConfig.roleAccess.list.includes(roleId);
  const canEdit = usuariosConfig.roleAccess.edit.includes(roleId);
  const canToggle = usuariosConfig.roleAccess.toggle.includes(roleId);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Usuarios - Listado</h2>
        <div className="actions">
          <button className="secondary-btn" onClick={reload} disabled={loading || toggleLoading}>
            Recargar
          </button>
          {canCreate ? (
            <Link className="primary-btn" to="/usuarios/crear">
              Crear
            </Link>
          ) : null}
        </div>
      </div>

      <UsuariosFilters filters={filters} onFilterChange={updateFilter} onClearFilters={clearFilters} />

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <UsuariosTable
            usuarios={usuarios}
            roles={roles}
            canViewDetail={canViewDetail}
            canEdit={canEdit}
            canToggle={canToggle}
            onToggleStatus={toggleUsuarioStatus}
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

export default UsuariosList;
