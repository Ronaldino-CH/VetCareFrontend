import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { moduleServices } from "../../services";
import { resolveFieldValue } from "../../utils/format";

function fullName(entity) {
  if (!entity) return "-";
  const names = [resolveFieldValue(entity, "Nombres"), resolveFieldValue(entity, "Apellidos")]
    .filter(Boolean)
    .join(" ")
    .trim();
  return names || resolveFieldValue(entity, "UserName") || "-";
}

function HistorialClinicoDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const historial = await moduleServices.historialClinico.findById(id);

        const idMascota = resolveFieldValue(historial, "IdMascota");
        const idVeterinario = resolveFieldValue(historial, "IdVeterinario");

        const [mascotas, usuariosActivos] = await Promise.all([
          moduleServices.mascotas.getActivos(),
          moduleServices.usuarios.getActivos()
        ]);

        const mascota = (mascotas || []).find((m) => String(resolveFieldValue(m, "IdMascota")) === String(idMascota));
        const veterinario = (usuariosActivos || []).find(
          (u) => String(resolveFieldValue(u, "IdUsuario")) === String(idVeterinario)
        );

        let duenio = null;
        if (mascota) {
          const idCliente = resolveFieldValue(mascota, "IdCliente");
          duenio = await moduleServices.clientes.findById(idCliente);
        }

        setDetail({ historial, mascota, veterinario, duenio });
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.Message ||
          err?.message ||
          "No se pudo cargar el detalle";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return (
    <section className="floating-detail-page">
      <article className="floating-detail-card">
        <header className="floating-detail-head">
          <h2>Historial Clínico</h2>
          <h3>{resolveFieldValue(detail?.mascota, "Nombre") || "-"}</h3>
        </header>

        {loading ? <p>Cargando...</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {!loading && !error && detail ? (
          <div className="floating-detail-body">
            <div><span>Dueño:</span><strong>{fullName(detail.duenio)}</strong></div>
            <div><span>Veterinario:</span><strong>{fullName(detail.veterinario)}</strong></div>
            <div><span>Diagnóstico:</span><strong>{resolveFieldValue(detail.historial, "Diagnostico") || "-"}</strong></div>
            <div><span>Tratamiento:</span><strong>{resolveFieldValue(detail.historial, "Tratamiento") || "-"}</strong></div>
            <div><span>Observaciones:</span><strong>{resolveFieldValue(detail.historial, "Observaciones") || "-"}</strong></div>
            <div><span>Fecha Creación:</span><strong>{resolveFieldValue(detail.historial, "FechaCrea") || "-"}</strong></div>
          </div>
        ) : null}

        <footer className="floating-detail-actions">
          <Link className="secondary-btn" to="/historial-clinico">Volver</Link>
        </footer>
      </article>
    </section>
  );
}

export default HistorialClinicoDetailPage;
