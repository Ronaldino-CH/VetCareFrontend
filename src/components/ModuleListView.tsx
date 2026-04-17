import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { canAccess, modulesConfig } from "../models/modulesConfig";
import { moduleServices } from "../services";
import { useModuleList } from "../hooks/useModuleList";
import { useRelationsData } from "../hooks/useRelationsData";
import { useAuth } from "../hooks/useAuth";
import { formatDateOnly, formatDateTime12, resolveFieldValue } from "../utils/format";
import ModuleTable from "./ModuleTable";
import FloatingDetailModal from "./FloatingDetailModal";

function mapRowWithRelations(row, columns, relationsData, moduleKey) {
  const mappedRow = { ...row };

  columns.forEach((column) => {
    if (!column.relationKey) return;

    const options = relationsData[column.relationKey] || [];
    const rawValue = resolveFieldValue(row, column.field);
    const match = options.find((option) => String(option.value) === String(rawValue));

    if ((moduleKey === "citas" || moduleKey === "historialClinico") && column.field === "IdVeterinario" && match?.raw) {
      mappedRow[column.field] = resolveFieldValue(match.raw, "Nombres") || match.label;
      return;
    }

    if (moduleKey === "mascotas" && column.field === "IdCliente" && match?.raw) {
      mappedRow[column.field] = resolveFieldValue(match.raw, "Nombres") || match.label;
      return;
    }

    mappedRow[column.field] = match ? match.label : rawValue;
  });

  if (moduleKey === "citas") {
    const currentDateTime = resolveFieldValue(row, "FechaHora");
    mappedRow.FechaHora = formatDateTime12(currentDateTime);
  }

  if (moduleKey === "historialClinico") {
    const currentDateTime = resolveFieldValue(row, "FechaCrea");
    mappedRow.FechaCrea = formatDateTime12(currentDateTime);
  }

  if (moduleKey === "mascotas") {
    const birthDate = resolveFieldValue(row, "FechaNacimiento");
    mappedRow.FechaNacimiento = formatDateOnly(birthDate);
  }

  return mappedRow;
}

function ModuleListView({ moduleKey }) {
  const { roleId } = useAuth();
  const config = modulesConfig[moduleKey];
  const service = moduleServices[moduleKey];
  const relationsData = useRelationsData(config);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const canCreate = canAccess(roleId, "create", moduleKey);
  const canEdit = canAccess(roleId, "edit", moduleKey);
  const canToggle = canAccess(roleId, "toggle", moduleKey);
  const canViewDetail = ["citas", "historialClinico"].includes(moduleKey) && canAccess(roleId, "list", moduleKey);

  const {
    items,
    loading,
    error,
    page,
    take,
    meta,
    filters,
    searchFields,
    setPage,
    setTake,
    updateFilter,
    clearFilters,
    reload
  } = useModuleList(service, config);

  const rowsToRender = useMemo(
    () => items.map((row) => mapRowWithRelations(row, config.columns, relationsData, moduleKey)),
    [config.columns, items, moduleKey, relationsData]
  );

  const handleToggleStatus = async (id) => {
    if (!service.toggleStatus || !canToggle) return;

    try {
      setToggleLoading(true);
      await service.toggleStatus(id);
      await reload();
    } finally {
      setToggleLoading(false);
    }
  };

  const handleOpenDetail = (id) => {
    if (!canViewDetail) return;
    setDetailId(id);
  };

  const handleCloseDetail = () => {
    setDetailId(null);
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>{config.title} - Listado</h2>
        <div className="actions">
          <button className="secondary-btn" onClick={reload} disabled={loading || toggleLoading}>
            Recargar
          </button>
          {canCreate ? (
            <Link className="primary-btn" to={`${config.basePath}/crear`}>
              Crear
            </Link>
          ) : null}
        </div>
      </div>

      {searchFields.length ? (
        <div className="search-panel">
          {searchFields.map((field) => (
            <label key={field.id} className="form-field compact">
              <span>{field.label}</span>
              {field.type === "status" ? (
                <select value={filters[field.id] || ""} onChange={(event) => updateFilter(field.id, event.target.value)}>
                  <option value="">Todos</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              ) : field.type === "select" ? (
                <select value={filters[field.id] || ""} onChange={(event) => updateFilter(field.id, event.target.value)}>
                  <option value="">Todos</option>
                  {(relationsData[field.relationKey] || []).map((option) => (
                    <option key={`${field.id}-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={filters[field.id] || ""}
                  placeholder={field.placeholder || "Buscar"}
                  onChange={(event) => updateFilter(field.id, event.target.value)}
                />
              )}
            </label>
          ))}

          <div className="search-actions">
            <button className="secondary-btn" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
        </div>
      ) : null}

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <ModuleTable
            rows={rowsToRender}
            columns={config.columns}
            idField={config.idField}
            statusField={config.statusField}
            basePath={config.basePath}
            onToggleStatus={config.statusField ? handleToggleStatus : undefined}
            canEdit={canEdit}
            canToggle={canToggle}
            canViewDetail={canViewDetail}
            onViewDetail={handleOpenDetail}
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

      {canViewDetail && detailId ? (
        <FloatingDetailModal moduleKey={moduleKey} id={detailId} onClose={handleCloseDetail} />
      ) : null}
    </section>
  );
}

export default ModuleListView;
