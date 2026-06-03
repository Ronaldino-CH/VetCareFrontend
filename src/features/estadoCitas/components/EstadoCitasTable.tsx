import { Link } from "react-router-dom";
import { formatValue, resolveFieldValue } from "../../../utils/format";

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

function EstadoCitasTable({ estadoCitas, canViewDetail, canEdit }) {
  if (!estadoCitas.length) {
    return <p>No hay datos para mostrar.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Codigo</th>
          {(canViewDetail || canEdit) ? <th>Acciones</th> : null}
        </tr>
      </thead>
      <tbody>
        {estadoCitas.map((estadoCita, index) => {
          const id = resolveFieldValue(estadoCita, "IdEstadoCita");
          const nombre = resolveFieldValue(estadoCita, "NombreEstado");
          const rowKey = id ?? `estado-cita-${index}`;

          return (
            <tr key={rowKey}>
              <td>{formatValue(id)}</td>
              <td>
                <span className="info-tag" style={getTagStyle(nombre)}>
                  {formatValue(nombre)}
                </span>
              </td>
              <td>{formatValue(resolveFieldValue(estadoCita, "Codigo"))}</td>

              {(canViewDetail || canEdit) ? (
                <td>
                  <div className="table-actions">
                    {canViewDetail ? (
                      <Link to={`/estado-citas/${id}`} className="secondary-btn">
                        Ver detalle
                      </Link>
                    ) : null}

                    {canEdit ? (
                      <Link to={`/estado-citas/${id}/editar`} className="link-btn">
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

export default EstadoCitasTable;
