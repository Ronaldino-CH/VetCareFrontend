import { Link } from "react-router-dom";
import { formatDateTime12, formatValue, resolveFieldValue } from "../../../utils/format";

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

function resolveOptionLabel(options, value, fallback = value) {
  const match = options.find((option) => String(option.value) === String(value));
  return match ? match.label : fallback;
}

function resolveVeterinarioLabel(veterinarios, value) {
  const match = veterinarios.find((option) => String(option.value) === String(value));
  if (!match) return value;

  return resolveFieldValue(match.raw, "Nombres") || match.label;
}

function CitasTable({ citas, mascotas, veterinarios, estadoCitas, canViewDetail, canEdit }) {
  if (!citas.length) {
    return <p>No hay datos para mostrar.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Motivo</th>
          <th>Observaciones</th>
          <th>Mascota</th>
          <th>Veterinario</th>
          <th>Estado cita</th>
          <th>Fecha y hora</th>
          {(canViewDetail || canEdit) ? <th>Acciones</th> : null}
        </tr>
      </thead>
      <tbody>
        {citas.map((cita, index) => {
          const id = resolveFieldValue(cita, "IdCita");
          const idMascota = resolveFieldValue(cita, "IdMascota");
          const idVeterinario = resolveFieldValue(cita, "IdVeterinario");
          const idEstadoCita = resolveFieldValue(cita, "IdEstadoCita");
          const estadoLabel = resolveOptionLabel(estadoCitas, idEstadoCita);
          const rowKey = id ?? `cita-${index}`;

          return (
            <tr key={rowKey}>
              <td>{formatValue(id)}</td>
              <td>{formatValue(resolveFieldValue(cita, "Motivo"))}</td>
              <td>{formatValue(resolveFieldValue(cita, "Observaciones"))}</td>
              <td>{formatValue(resolveOptionLabel(mascotas, idMascota))}</td>
              <td>{formatValue(resolveVeterinarioLabel(veterinarios, idVeterinario))}</td>
              <td>
                <span className="info-tag" style={getTagStyle(estadoLabel)}>
                  {formatValue(estadoLabel)}
                </span>
              </td>
              <td>{formatDateTime12(resolveFieldValue(cita, "FechaHora"))}</td>

              {(canViewDetail || canEdit) ? (
                <td>
                  <div className="table-actions">
                    {canViewDetail ? (
                      <Link to={`/citas/${id}`} className="secondary-btn">
                        Ver detalle
                      </Link>
                    ) : null}

                    {canEdit ? (
                      <Link to={`/citas/${id}/editar`} className="link-btn">
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

export default CitasTable;
