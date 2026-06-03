import { useEffect, useState } from "react";
import citasService from "../../../services/citasService";
import clientesService from "../../../services/clientesService";
import estadoCitasService from "../../../services/estadoCitasService";
import mascotasService from "../../../services/mascotasService";
import usuariosService from "../../../services/usuariosService";
import { resolveFieldValue } from "../../../utils/format";

export function useCitaDetail(id) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const cita = await citasService.findById(id);

        const idMascota = resolveFieldValue(cita, "IdMascota");
        const idVeterinario = resolveFieldValue(cita, "IdVeterinario");
        const idEstadoCita = resolveFieldValue(cita, "IdEstadoCita");

        const [mascotas, usuariosActivos, estados] = await Promise.all([
          mascotasService.getActivos(),
          usuariosService.getActivos(),
          estadoCitasService.findAll()
        ]);

        const mascota = (mascotas || []).find((item) => String(resolveFieldValue(item, "IdMascota")) === String(idMascota));
        const veterinario = (usuariosActivos || []).find(
          (item) => String(resolveFieldValue(item, "IdUsuario")) === String(idVeterinario)
        );
        const estado = (estados || []).find(
          (item) => String(resolveFieldValue(item, "IdEstadoCita")) === String(idEstadoCita)
        );

        let duenio = null;
        if (mascota) {
          const idCliente = resolveFieldValue(mascota, "IdCliente");
          duenio = await clientesService.findById(idCliente);
        }

        setDetail({ cita, mascota, veterinario, estado, duenio });
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

    if (id) load();
  }, [id]);

  return { detail, loading, error };
}
