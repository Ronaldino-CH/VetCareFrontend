import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { canAccess, modulesConfig } from "../models/modulesConfig";
import { moduleServices } from "../services";
import { useAuth } from "../hooks/useAuth";
import { useRelationsData } from "../hooks/useRelationsData";
import { formatValue, resolveFieldValue } from "../utils/format";

function ModuleDetailView({ moduleKey }) {
  const { id } = useParams();
  const { roleId } = useAuth();
  const config = modulesConfig[moduleKey];
  const service = moduleServices[moduleKey];
  const relationData = useRelationsData(config);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canEdit = canAccess(roleId, "edit", moduleKey);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await service.findById(id);
        setItem(data);
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
  }, [id, service]);

  const detailRows = useMemo(() => {
    if (!item) return [];

    return config.columns.map((column) => {
      const rawValue = resolveFieldValue(item, column.field);

      if (column.relationKey) {
        const options = relationData[column.relationKey] || [];
        const match = options.find((option) => String(option.value) === String(rawValue));
        return { label: column.label, value: match ? match.label : formatValue(rawValue) };
      }

      if (column.type === "status") {
        return { label: column.label, value: rawValue ? "Activo" : "Inactivo" };
      }

      return { label: column.label, value: formatValue(rawValue) };
    });
  }, [config.columns, item, relationData]);

  return (
    <section className="page">
      <div className="page-header">
        <h2>{config.title} - Detalle</h2>
        <div className="actions">
          <Link className="secondary-btn" to={config.basePath}>
            Volver
          </Link>
          {canEdit ? (
            <Link className="primary-btn" to={`${config.basePath}/${id}/editar`}>
              Editar
            </Link>
          ) : null}
        </div>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error && item ? (
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

export default ModuleDetailView;
