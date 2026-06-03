import { useEffect, useState } from "react";
import rolesService from "../../../services/rolesService";
import usuariosService from "../../../services/usuariosService";
import { resolveFieldValue } from "../../../utils/format";

export function useUsuarioDetail(id) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsuario = async () => {
      try {
        setLoading(true);
        setError("");

        const [usuarioData, rolesData] = await Promise.all([
          usuariosService.findById(id),
          rolesService.findAll()
        ]);

        const idRol = resolveFieldValue(usuarioData, "IdRol");
        const roleMatch = (rolesData || []).find((item) => String(resolveFieldValue(item, "IdRol")) === String(idRol));

        setUsuario(usuarioData);
        setRol(roleMatch || null);
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

    if (id) loadUsuario();
  }, [id]);

  return { usuario, rol, loading, error };
}
