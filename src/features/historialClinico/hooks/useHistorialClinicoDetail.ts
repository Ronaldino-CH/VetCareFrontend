import { useEffect, useState } from "react";
import clientesService from "../../../services/clientesService";
import historialClinicoService from "../../../services/historialClinicoService";
import mascotasService from "../../../services/mascotasService";
import usuariosService from "../../../services/usuariosService";
import { resolveFieldValue } from "../../../utils/format";

export function useHistorialClinicoDetail(id) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const historial = await historialClinicoService.findById(id);

        const idMascota = resolveFieldValue(historial, "IdMascota");
        const idVeterinario = resolveFieldValue(historial, "IdVeterinario");

        const [mascotas, usuariosActivos] = await Promise.all([
          mascotasService.getActivos(),
          usuariosService.getActivos()
        ]);

        const mascota = (mascotas || []).find((item) => String(resolveFieldValue(item, "IdMascota")) === String(idMascota));
        const veterinario = (usuariosActivos || []).find(
          (item) => String(resolveFieldValue(item, "IdUsuario")) === String(idVeterinario)
        );

        let duenio = null;
        if (mascota) {
          const idCliente = resolveFieldValue(mascota, "IdCliente");
          duenio = await clientesService.findById(idCliente);
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

    if (id) load();
  }, [id]);

  return { detail, loading, error };
}
