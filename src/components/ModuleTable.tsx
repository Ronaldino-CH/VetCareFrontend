import { Link } from "react-router-dom";
import { formatValue, resolveFieldValue } from "../utils/format";

function StatusBadge({ value }) {
  const isActive = Boolean(value);
  return <span className={`status-badge ${isActive ? "active" : "inactive"}`}>{isActive ? "Activo" : "Inactivo"}</span>;
}

function hashString(value) {
  let hash = 0;
  const input = String(value || "");
  for (let index = 0; index < input.length; index += 1) {
    hash = input.charCodeAt(index) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getTagStyle(value) {
  const text = String(value || "").trim().toLowerCase();

  if (text.includes("pendiente")) {
    return { backgroundColor: "#fffbeb", borderColor: "#fcd34d", color: "#92400e" };
  }

  if (text.includes("cancel")) {
    return { backgroundColor: "#fee2e2", borderColor: "#fca5a5", color: "#991b1b" };
  }

  if (text.includes("atendid")) {
    return { backgroundColor: "#dcfce7", borderColor: "#86efac", color: "#166534" };
  }

  const hue = hashString(text) % 360;
  return {
    backgroundColor: `hsl(${hue} 92% 95%)`,
    borderColor: `hsl(${hue} 65% 76%)`,
    color: `hsl(${hue} 60% 28%)`
  };
}

function ModuleTable({
  rows,
  columns,
  basePath,
  idField,
  statusField,
  onToggleStatus,
  canEdit,
  canToggle,
  canViewDetail,
  onViewDetail
}) {
  if (!rows.length) {
    return <p>No hay datos para mostrar.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.field}>{column.label}</th>
          ))}
          {(canEdit || canToggle || canViewDetail) ? <th>Acciones</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const id = resolveFieldValue(row, idField);
          const rowKey = id ?? `row-${index}`;
          const statusValue = statusField ? resolveFieldValue(row, statusField) : null;

          return (
            <tr key={rowKey}>
              {columns.map((column) => {
                const value = resolveFieldValue(row, column.field);

                return (
                  <td key={`${rowKey}-${column.field}`}>
                    {column.type === "status" ? <StatusBadge value={value} /> : null}
                    {column.type === "tag" ? (
                      <span className="info-tag" style={getTagStyle(value)}>
                        {formatValue(value)}
                      </span>
                    ) : null}
                    {!column.type ? formatValue(value) : null}
                  </td>
                );
              })}

              {(canEdit || canToggle || canViewDetail) ? (
                <td>
                  <div className="table-actions">
                    {id !== undefined && id !== null ? (
                      <>
                        {canViewDetail ? (
                          <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => onViewDetail?.(id)}
                          >
                            Ver detalle
                          </button>
                        ) : null}

                        {canEdit ? (
                          <Link to={`${basePath}/${id}/editar`} className="link-btn">
                            Editar
                          </Link>
                        ) : null}

                        {canToggle && statusField && typeof onToggleStatus === "function" ? (
                          <button
                            type="button"
                            className={statusValue ? "warn-btn" : "success-btn"}
                            onClick={() => onToggleStatus(id)}
                          >
                            {statusValue ? "Desactivar" : "Activar"}
                          </button>
                        ) : null}
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </td>
              ) : null}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ModuleTable;
