import { Link } from "react-router-dom";
import { formatValue, resolveFieldValue } from "../../../utils/format";

function ClienteStatusBadge({ value }) {
  const isActive = Boolean(value);
  return <span className={`status-badge ${isActive ? "active" : "inactive"}`}>{isActive ? "Activo" : "Inactivo"}</span>;
}

function ClientesTable({ clientes, canViewDetail, canEdit, canToggle, onToggleStatus }) {
  if (!clientes.length) {
    return <p>No hay datos para mostrar.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Documento</th>
          <th>Telefono</th>
          <th>Correo</th>
          <th>Estado</th>
          {(canViewDetail || canEdit || canToggle) ? <th>Acciones</th> : null}
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente, index) => {
          const id = resolveFieldValue(cliente, "IdCliente");
          const estado = resolveFieldValue(cliente, "EstadoCliente");
          const rowKey = id ?? `cliente-${index}`;

          return (
            <tr key={rowKey}>
              <td>{formatValue(id)}</td>
              <td>{formatValue(resolveFieldValue(cliente, "Nombres"))}</td>
              <td>{formatValue(resolveFieldValue(cliente, "Apellidos"))}</td>
              <td>{formatValue(resolveFieldValue(cliente, "Documento"))}</td>
              <td>{formatValue(resolveFieldValue(cliente, "Telefono"))}</td>
              <td>{formatValue(resolveFieldValue(cliente, "Correo"))}</td>
              <td>
                <ClienteStatusBadge value={estado} />
              </td>

              {(canViewDetail || canEdit || canToggle) ? (
                <td>
                  <div className="table-actions">
                    {canViewDetail ? (
                      <Link to={`/clientes/${id}`} className="secondary-btn">
                        Ver detalle
                      </Link>
                    ) : null}

                    {canEdit ? (
                      <Link to={`/clientes/${id}/editar`} className="link-btn">
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

export default ClientesTable;
