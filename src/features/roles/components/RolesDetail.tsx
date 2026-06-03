import { Link, useParams } from "react-router-dom";
import { rolesConfig } from "../../../config/modules";
import { useAuth } from "../../../hooks/useAuth";
import { formatValue, resolveFieldValue } from "../../../utils/format";
import { useRolDetail } from "../hooks/useRolDetail";

function RolesDetail() {
  const { id } = useParams();
  const { roleId } = useAuth();
  const { rol, loading, error } = useRolDetail(id);
  const canEdit = rolesConfig.roleAccess.edit.includes(roleId);

  const detailRows = rol
    ? [
        { label: "ID", value: formatValue(resolveFieldValue(rol, "IdRol")) },
        { label: "Nombre", value: formatValue(resolveFieldValue(rol, "Nombre")) }
      ]
    : [];

  return (
    <section className="page">
      <div className="page-header">
        <h2>Roles - Detalle</h2>
        <div className="actions">
          <Link className="secondary-btn" to="/roles">
            Volver
          </Link>
          {canEdit ? (
            <Link className="primary-btn" to={`/roles/${id}/editar`}>
              Editar
            </Link>
          ) : null}
        </div>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error && rol ? (
        <div className="detail-grid">
          {detailRows.map((row) => (
            <div key={row.label} className="detail-item">
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default RolesDetail;
