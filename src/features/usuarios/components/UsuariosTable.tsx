import { Link } from "react-router-dom";
import { formatValue, resolveFieldValue } from "../../../utils/format";

function UsuarioStatusBadge({ value }) {
  const isActive = Boolean(value);
  return <span className={`status-badge ${isActive ? "active" : "inactive"}`}>{isActive ? "Activo" : "Inactivo"}</span>;
}

function resolveRolLabel(roles, idRol) {
  const match = roles.find((rol) => String(rol.value) === String(idRol));
  return match ? match.label : idRol;
}

function UsuariosTable({ usuarios, roles, canViewDetail, canEdit, canToggle, onToggleStatus }) {
  if (!usuarios.length) {
    return <p>No hay datos para mostrar.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Rol</th>
          <th>Estado</th>
          {(canViewDetail || canEdit || canToggle) ? <th>Acciones</th> : null}
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario, index) => {
          const id = resolveFieldValue(usuario, "IdUsuario");
          const idRol = resolveFieldValue(usuario, "IdRol");
          const estado = resolveFieldValue(usuario, "EstadoUsuario");
          const rowKey = id ?? `usuario-${index}`;

          return (
            <tr key={rowKey}>
              <td>{formatValue(id)}</td>
              <td>{formatValue(resolveFieldValue(usuario, "UserName"))}</td>
              <td>{formatValue(resolveFieldValue(usuario, "Nombres"))}</td>
              <td>{formatValue(resolveFieldValue(usuario, "Apellidos"))}</td>
              <td>{formatValue(resolveRolLabel(roles, idRol))}</td>
              <td>
                <UsuarioStatusBadge value={estado} />
              </td>

              {(canViewDetail || canEdit || canToggle) ? (
                <td>
                  <div className="table-actions">
                    {canViewDetail ? (
                      <Link to={`/usuarios/${id}`} className="secondary-btn">
                        Ver detalle
                      </Link>
                    ) : null}

                    {canEdit ? (
                      <Link to={`/usuarios/${id}/editar`} className="link-btn">
                        Editar
                      </Link>
                    ) : null}

                    {canToggle ? (
                      <button
                        type="button"
                        className={estado ? "warn-btn" : "success-btn"}
                        onClick={() => onToggleStatus(id)}
                      >
                        {estado ? "Desactivar" : "Activar"}
                      </button>
                    ) : null}
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

export default UsuariosTable;
