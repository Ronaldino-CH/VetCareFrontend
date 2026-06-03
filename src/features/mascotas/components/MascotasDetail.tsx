import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { mascotasConfig } from "../../../config/modules";
import { useAuth } from "../../../hooks/useAuth";
import clientesService from "../../../services/clientesService";
import mascotasService from "../../../services/mascotasService";
import { formatDateOnly, formatValue, resolveFieldValue } from "../../../utils/format";

function getClienteLabel(clientes, idCliente) {
  const match = clientes.find((cliente) => String(resolveFieldValue(cliente, "IdCliente")) === String(idCliente));
  if (!match) return idCliente;

  const nombres = resolveFieldValue(match, "Nombres");
  const apellidos = resolveFieldValue(match, "Apellidos");
  return [nombres, apellidos].filter(Boolean).join(" ").trim() || idCliente;
}

function MascotasDetail() {
  const { id } = useParams();
  const { roleId } = useAuth();
  const [mascota, setMascota] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canEdit = mascotasConfig.roleAccess.edit.includes(roleId);

  useEffect(() => {
    const loadMascota = async () => {
      try {
        setLoading(true);
        setError("");
        const [mascotaData, clientesData] = await Promise.all([
          mascotasService.findById(id),
          clientesService.getActivos()
        ]);

        setMascota(mascotaData);
        setClientes(Array.isArray(clientesData) ? clientesData : []);
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

    loadMascota();
  }, [id]);

  const detailRows = useMemo(() => {
    if (!mascota) return [];

    const idCliente = resolveFieldValue(mascota, "IdCliente");

    return [
      { label: "ID", value: formatValue(resolveFieldValue(mascota, "IdMascota")) },
      { label: "Nombre", value: formatValue(resolveFieldValue(mascota, "Nombre")) },
      { label: "Especie", value: formatValue(resolveFieldValue(mascota, "Especie")) },
      { label: "Raza", value: formatValue(resolveFieldValue(mascota, "Raza")) },
      { label: "Sexo", value: formatValue(resolveFieldValue(mascota, "Sexo")) },
      { label: "Nacimiento", value: formatDateOnly(resolveFieldValue(mascota, "FechaNacimiento")) },
      { label: "Peso", value: formatValue(resolveFieldValue(mascota, "Peso")) },
      { label: "Color", value: formatValue(resolveFieldValue(mascota, "Color")) },
      { label: "Cliente", value: formatValue(getClienteLabel(clientes, idCliente)) },
      { label: "Estado", value: resolveFieldValue(mascota, "EstadoMascota") ? "Activo" : "Inactivo" }
    ];
  }, [clientes, mascota]);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Mascotas - Detalle</h2>
        <div className="actions">
          <Link className="secondary-btn" to="/mascotas">
            Volver
          </Link>
          {canEdit ? (
            <Link className="primary-btn" to={`/mascotas/${id}/editar`}>
              Editar
            </Link>
          ) : null}
        </div>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error && mascota ? (
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

export default MascotasDetail;
