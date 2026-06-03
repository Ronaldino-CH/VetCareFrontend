import { Link } from "react-router-dom";
import { formatValue, resolveFieldValue } from "../../../utils/format";

function RolesTable({ roles, canViewDetail, canEdit }) {
  if (!roles.length) {
    return <p>No hay datos para mostrar.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          {(canViewDetail || canEdit) ? <th>Acciones</th> : null}
        </tr>
      </thead>
      <tbody>
        {roles.map((rol, index) => {
          const id = resolveFieldValue(rol, "IdRol");
          const rowKey = id ?? `rol-${index}`;

          return (
            <tr key={rowKey}>
              <td>{formatValue(id)}</td>
              <td>{formatValue(resolveFieldValue(rol, "Nombre"))}</td>

              {(canViewDetail || canEdit) ? (
                <td>
                  <div className="table-actions">
                    {canViewDetail ? (
                      <Link to={`/roles/${id}`} className="secondary-btn">
                        Ver detalle
                      </Link>
                    ) : null}

                    {canEdit ? (
                      <Link to={`/roles/${id}/editar`} className="link-btn">
                        Editar
                      </Link>
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

export default RolesTable;
