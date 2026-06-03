import { useEffect, useState } from "react";
import rolesService from "../../../services/rolesService";

export function useRolDetail(id) {
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRol = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await rolesService.findById(id);
        setRol(data);
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

    if (id) loadRol();
  }, [id]);

  return { rol, loading, error };
}
