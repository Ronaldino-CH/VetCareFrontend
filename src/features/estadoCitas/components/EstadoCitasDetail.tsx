import { Link, useParams } from "react-router-dom";
import { estadoCitasConfig } from "../../../config/modules";
import { useAuth } from "../../../hooks/useAuth";
import { formatValue, resolveFieldValue } from "../../../utils/format";
import { useEstadoCitaDetail } from "../hooks/useEstadoCitaDetail";

function EstadoCitasDetail() {
  const { id } = useParams();
  const { roleId } = useAuth();
  const { estadoCita, loading, error } = useEstadoCitaDetail(id);
  const canEdit = estadoCitasConfig.roleAccess.edit.includes(roleId);

  const detailRows = estadoCita
    ? [
        { label: "ID", value: formatValue(resolveFieldValue(estadoCita, "IdEstadoCita")) },
        { label: "Nombre", value: formatValue(resolveFieldValue(estadoCita, "NombreEstado")) },
        { label: "Codigo", value: formatValue(resolveFieldValue(estadoCita, "Codigo")) }
      ]
    : [];

  return (
    <section className="page">
      <div className="page-header">
        <h2>Estado de Citas - Detalle</h2>
        <div className="actions">
          <Link className="secondary-btn" to="/estado-citas">
            Volver
          </Link>
          {canEdit ? (
            <Link className="primary-btn" to={`/estado-citas/${id}/editar`}>
              Editar
            </Link>
          ) : null}
        </div>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error && estadoCita ? (
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

export default EstadoCitasDetail;
