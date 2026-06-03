import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { clientesConfig } from "../../../config/modules";
import { useAuth } from "../../../hooks/useAuth";
import clientesService from "../../../services/clientesService";
import { formatValue, resolveFieldValue } from "../../../utils/format";

function ClientesDetail() {
  const { id } = useParams();
  const { roleId } = useAuth();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canEdit = clientesConfig.roleAccess.edit.includes(roleId);

  useEffect(() => {
    const loadCliente = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await clientesService.findById(id);
        setCliente(data);
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

    loadCliente();
  }, [id]);

  const detailRows = useMemo(() => {
    if (!cliente) return [];

    return [
      { label: "ID", value: formatValue(resolveFieldValue(cliente, "IdCliente")) },
      { label: "Nombres", value: formatValue(resolveFieldValue(cliente, "Nombres")) },
      { label: "Apellidos", value: formatValue(resolveFieldValue(cliente, "Apellidos")) },
      { label: "Documento", value: formatValue(resolveFieldValue(cliente, "Documento")) },
      { label: "Telefono", value: formatValue(resolveFieldValue(cliente, "Telefono")) },
      { label: "Correo", value: formatValue(resolveFieldValue(cliente, "Correo")) },
      { label: "Estado", value: resolveFieldValue(cliente, "EstadoCliente") ? "Activo" : "Inactivo" }
    ];
  }, [cliente]);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Clientes - Detalle</h2>
        <div className="actions">
          <Link className="secondary-btn" to="/clientes">
            Volver
          </Link>
          {canEdit ? (
            <Link className="primary-btn" to={`/clientes/${id}/editar`}>
              Editar
            </Link>
          ) : null}
        </div>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error && cliente ? (
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

export default ClientesDetail;
