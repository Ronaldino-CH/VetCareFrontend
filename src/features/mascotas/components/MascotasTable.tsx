import { Link } from "react-router-dom";
import { formatDateOnly, formatValue, resolveFieldValue } from "../../../utils/format";

function MascotaStatusBadge({ value }) {
  const isActive = Boolean(value);
  return <span className={`status-badge ${isActive ? "active" : "inactive"}`}>{isActive ? "Activo" : "Inactivo"}</span>;
}

function resolveClienteLabel(clientes, idCliente) {
  const match = clientes.find((cliente) => String(cliente.value) === String(idCliente));
  if (!match) return idCliente;

  const nombres = resolveFieldValue(match.raw, "Nombres");
  return nombres || match.label;
}

function MascotasTable({ mascotas, clientes, canViewDetail, canEdit, canToggle, onToggleStatus }) {
  if (!mascotas.length) {
    return <p>No hay datos para mostrar.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Especie</th>
          <th>Raza</th>
          <th>Sexo</th>
          <th>Nacimiento</th>
          <th>Peso</th>
          <th>Color</th>
          <th>Cliente</th>
          <th>Estado</th>
          {(canViewDetail || canEdit || canToggle) ? <th>Acciones</th> : null}
        </tr>
      </thead>
      <tbody>
        {mascotas.map((mascota, index) => {
          const id = resolveFieldValue(mascota, "IdMascota");
          const idCliente = resolveFieldValue(mascota, "IdCliente");
          const estado = resolveFieldValue(mascota, "EstadoMascota");
          const rowKey = id ?? `mascota-${index}`;

          return (
            <tr key={rowKey}>
              <td>{formatValue(id)}</td>
              <td>{formatValue(resolveFieldValue(mascota, "Nombre"))}</td>
              <td>{formatValue(resolveFieldValue(mascota, "Especie"))}</td>
              <td>{formatValue(resolveFieldValue(mascota, "Raza"))}</td>
              <td>{formatValue(resolveFieldValue(mascota, "Sexo"))}</td>
              <td>{formatDateOnly(resolveFieldValue(mascota, "FechaNacimiento"))}</td>
              <td>{formatValue(resolveFieldValue(mascota, "Peso"))}</td>
              <td>{formatValue(resolveFieldValue(mascota, "Color"))}</td>
              <td>{formatValue(resolveClienteLabel(clientes, idCliente))}</td>
              <td>
                <MascotaStatusBadge value={estado} />
              </td>

              {(canViewDetail || canEdit || canToggle) ? (
                <td>
                  <div className="table-actions">
                    {canViewDetail ? (
                      <Link to={`/mascotas/${id}`} className="secondary-btn">
                        Ver detalle
                      </Link>
                    ) : null}

                    {canEdit ? (
                      <Link to={`/mascotas/${id}/editar`} className="link-btn">
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

export default MascotasTable;
