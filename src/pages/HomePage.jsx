import { useEffect, useMemo, useState } from "react";
import { canAccess } from "../models/modulesConfig";
import { useAuth } from "../hooks/useAuth";
import { moduleServices } from "../services";
import { formatDateTime12, resolveFieldValue } from "../utils/format";

function getLocalDateLabel(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function safeNumber(value) {
  return Number.isFinite(value) ? value : 0;
}

function HomePage() {
  const { roleId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    clientes: [],
    mascotas: [],
    citas: [],
    historiales: [],
    estadoCitas: []
  });

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const loaders = [];

        if (canAccess(roleId, "list", "clientes")) loaders.push(moduleServices.clientes.findAll().then((v) => ["clientes", v]));
        if (canAccess(roleId, "list", "mascotas")) loaders.push(moduleServices.mascotas.findAll().then((v) => ["mascotas", v]));
        if (canAccess(roleId, "list", "citas")) loaders.push(moduleServices.citas.findAll().then((v) => ["citas", v]));
        if (canAccess(roleId, "list", "historialClinico")) {
          loaders.push(moduleServices.historialClinico.findAll().then((v) => ["historiales", v]));
        }
        if (canAccess(roleId, "list", "estadoCitas")) {
          loaders.push(moduleServices.estadoCitas.findAll().then((v) => ["estadoCitas", v]));
        }

        const results = await Promise.all(loaders);
        if (!mounted) return;

        const nextData = { clientes: [], mascotas: [], citas: [], historiales: [], estadoCitas: [] };
        results.forEach(([key, value]) => {
          nextData[key] = Array.isArray(value) ? value : [];
        });
        setData(nextData);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || err?.message || "No se pudo cargar el dashboard.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [roleId]);

  const analytics = useMemo(() => {
    const citas = data.citas || [];
    const estados = data.estadoCitas || [];
    const today = getLocalDateLabel(new Date());

    const citasHoy = citas.filter((cita) => getLocalDateLabel(resolveFieldValue(cita, "FechaHora")) === today);
    const citasTotales = citas.length;
    const atencionesHoy = citasHoy.length;

    const byEstado = estados.map((estado) => {
      const idEstado = resolveFieldValue(estado, "IdEstadoCita");
      const nombre = resolveFieldValue(estado, "NombreEstado") || "Sin estado";
      const total = citas.filter((cita) => String(resolveFieldValue(cita, "IdEstadoCita")) === String(idEstado)).length;
      const percentage = citasTotales ? Math.round((total * 100) / citasTotales) : 0;
      return { id: idEstado, nombre, total, percentage };
    });

    const citasRecientes = [...citas]
      .sort((a, b) => new Date(resolveFieldValue(b, "FechaHora")) - new Date(resolveFieldValue(a, "FechaHora")))
      .slice(0, 5);

    const topEstado = [...byEstado].sort((a, b) => b.total - a.total)[0];

    return {
      totalClientes: data.clientes.length,
      totalMascotas: data.mascotas.length,
      totalCitas: citasTotales,
      totalHistoriales: data.historiales.length,
      citasHoy: atencionesHoy,
      porcentajeAtencionHoy: citasTotales ? Math.round((atencionesHoy * 100) / citasTotales) : 0,
      byEstado,
      citasRecientes,
      topEstado: topEstado?.nombre || "-"
    };
  }, [data]);

  return (
    <section className="dashboard-page ordered clean">
      {loading ? <p>Cargando indicadores...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <div className="kpi-grid">
            <article className="kpi-card">
              <span>Clientes</span>
              <strong>{safeNumber(analytics.totalClientes)}</strong>
            </article>
            <article className="kpi-card">
              <span>Mascotas</span>
              <strong>{safeNumber(analytics.totalMascotas)}</strong>
            </article>
            <article className="kpi-card">
              <span>Citas Totales</span>
              <strong>{safeNumber(analytics.totalCitas)}</strong>
            </article>
            <article className="kpi-card">
              <span>Historiales</span>
              <strong>{safeNumber(analytics.totalHistoriales)}</strong>
            </article>
          </div>

          <div className="dashboard-row">
            <article className="dashboard-card clean analytics-card">
              <h3>Rendimiento Diario</h3>
              <p>
                Citas de hoy: <strong>{safeNumber(analytics.citasHoy)}</strong>
              </p>
              <p>
                Avance sobre total: <strong>{safeNumber(analytics.porcentajeAtencionHoy)}%</strong>
              </p>
              <p>
                Estado dominante: <strong>{analytics.topEstado}</strong>
              </p>
            </article>

            <article className="dashboard-card clean analytics-card">
              <h3>Estado de Citas (%)</h3>
              <div className="state-bars">
                {analytics.byEstado.length ? (
                  analytics.byEstado.map((state) => (
                    <div key={state.id || state.nombre} className="state-row">
                      <div className="state-row-head">
                        <span>{state.nombre}</span>
                        <strong>{state.percentage}%</strong>
                      </div>
                      <div className="state-track">
                        <div className="state-fill" style={{ width: `${Math.min(100, state.percentage)}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Sin datos de estado.</p>
                )}
              </div>
            </article>
          </div>

          <article className="dashboard-card clean activity-card">
            <h3>Actividad Reciente (Citas)</h3>
            {analytics.citasRecientes.length ? (
              <div className="activity-list">
                {analytics.citasRecientes.map((cita, index) => (
                  <div key={resolveFieldValue(cita, "IdCita") || index} className="activity-item">
                    <strong>{resolveFieldValue(cita, "Motivo") || "Sin motivo"}</strong>
                    <span>{formatDateTime12(resolveFieldValue(cita, "FechaHora"))}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay citas recientes para mostrar.</p>
            )}
          </article>
        </>
      ) : null}
    </section>
  );
}

export default HomePage;
