import { Link } from "react-router-dom";
import { formatDateTime12, formatValue, resolveFieldValue } from "../../../utils/format";

function resolveOptionLabel(options, value, fallback = value) {
  const match = options.find((option) => String(option.value) === String(value));
  return match ? match.label : fallback;
}

function resolveVeterinarioLabel(veterinarios, value) {
  const match = veterinarios.find((option) => String(option.value) === String(value));
  if (!match) return value;

  return resolveFieldValue(match.raw, "Nombres") || match.label;
}

function HistorialClinicoTable({ historiales, mascotas, veterinarios, canViewDetail, canEdit }) {
  if (!historiales.length) {
    return <p>No hay datos para mostrar.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Mascota</th>
          <th>Diagnostico</th>
          <th>Tratamiento</th>
          <th>Observaciones</th>
          <th>Veterinario</th>
          <th>Fecha y Hora</th>
          {(canViewDetail || canEdit) ? <th>Acciones</th> : null}
        </tr>
      </thead>
      <tbody>
        {historiales.map((historial, index) => {
          const id = resolveFieldValue(historial, "IdHistorial");
          const idMascota = resolveFieldValue(historial, "IdMascota");
          const idVeterinario = resolveFieldValue(historial, "IdVeterinario");
          const rowKey = id ?? `historial-${index}`;

          return (
            <tr key={rowKey}>
              <td>{formatValue(id)}</td>
              <td>{formatValue(resolveOptionLabel(mascotas, idMascota))}</td>
              <td>{formatValue(resolveFieldValue(historial, "Diagnostico"))}</td>
              <td>{formatValue(resolveFieldValue(historial, "Tratamiento"))}</td>
              <td>{formatValue(resolveFieldValue(historial, "Observaciones"))}</td>
              <td>{formatValue(resolveVeterinarioLabel(veterinarios, idVeterinario))}</td>
              <td>{formatDateTime12(resolveFieldValue(historial, "FechaCrea"))}</td>

              {(canViewDetail || canEdit) ? (
                <td>
                  <div className="table-actions">
                    {canViewDetail ? (
                      <Link to={`/historial-clinico/${id}`} className="secondary-btn">
                        Ver detalle
                      </Link>
                    ) : null}

                    {canEdit ? (
                      <Link to={`/historial-clinico/${id}/editar`} className="link-btn">
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

export default HistorialClinicoTable;
