import { Link, useParams } from "react-router-dom";
import { resolveFieldValue } from "../../../utils/format";
import { useCitaDetail } from "../hooks/useCitaDetail";

function fullName(entity) {
  if (!entity) return "-";
  const names = [resolveFieldValue(entity, "Nombres"), resolveFieldValue(entity, "Apellidos")]
    .filter(Boolean)
    .join(" ")
    .trim();
  return names || resolveFieldValue(entity, "UserName") || "-";
}

function CitasDetail() {
  const { id } = useParams();
  const { detail, loading, error } = useCitaDetail(id);

  return (
    <section className="floating-detail-page">
      <article className="floating-detail-card">
        <header className="floating-detail-head">
          <h2>Cita</h2>
          <h3>{resolveFieldValue(detail?.mascota, "Nombre") || "-"}</h3>
        </header>

        {loading ? <p>Cargando...</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {!loading && !error && detail ? (
          <div className="floating-detail-body">
            <div><span>Dueño:</span><strong>{fullName(detail.duenio)}</strong></div>
            <div><span>Veterinario:</span><strong>{fullName(detail.veterinario)}</strong></div>
            <div><span>Fecha y Hora:</span><strong>{resolveFieldValue(detail.cita, "FechaHora") || "-"}</strong></div>
            <div><span>Estado:</span><strong>{resolveFieldValue(detail.estado, "NombreEstado") || "-"}</strong></div>
            <div><span>Observaciones:</span><strong>{resolveFieldValue(detail.cita, "Observaciones") || "-"}</strong></div>
            <div><span>Fecha Creación:</span><strong>{resolveFieldValue(detail.cita, "FechaCrea") || "-"}</strong></div>
          </div>
        ) : null}

        <footer className="floating-detail-actions">
          <Link className="secondary-btn" to="/citas">Volver</Link>
        </footer>
      </article>
    </section>
  );
}

export default CitasDetail;
