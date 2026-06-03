import { Link, useParams } from "react-router-dom";
import { usuariosConfig } from "../../../config/modules";
import { useAuth } from "../../../hooks/useAuth";
import { formatValue, resolveFieldValue } from "../../../utils/format";
import { useUsuarioDetail } from "../hooks/useUsuarioDetail";

function UsuariosDetail() {
  const { id } = useParams();
  const { roleId } = useAuth();
  const { usuario, rol, loading, error } = useUsuarioDetail(id);
  const canEdit = usuariosConfig.roleAccess.edit.includes(roleId);

  const detailRows = usuario
    ? [
        { label: "ID", value: formatValue(resolveFieldValue(usuario, "IdUsuario")) },
        { label: "Usuario", value: formatValue(resolveFieldValue(usuario, "UserName")) },
        { label: "Nombres", value: formatValue(resolveFieldValue(usuario, "Nombres")) },
        { label: "Apellidos", value: formatValue(resolveFieldValue(usuario, "Apellidos")) },
        { label: "Rol", value: formatValue(resolveFieldValue(rol, "Nombre") || resolveFieldValue(usuario, "IdRol")) },
        { label: "Estado", value: resolveFieldValue(usuario, "EstadoUsuario") ? "Activo" : "Inactivo" }
      ]
    : [];

  return (
    <section className="page">
      <div className="page-header">
        <h2>Usuarios - Detalle</h2>
        <div className="actions">
          <Link className="secondary-btn" to="/usuarios">
            Volver
          </Link>
          {canEdit ? (
            <Link className="primary-btn" to={`/usuarios/${id}/editar`}>
              Editar
            </Link>
          ) : null}
        </div>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error && usuario ? (
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

export default UsuariosDetail;
