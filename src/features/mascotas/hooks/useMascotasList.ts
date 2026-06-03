import { useEffect, useMemo, useState } from "react";
import { mascotasConfig } from "../../../config/modules";
import type { Mascota } from "../../../models/entities/mascota";
import clientesService from "../../../services/clientesService";
import mascotasService from "../../../services/mascotasService";
import { resolveFieldValue } from "../../../utils/format";

function buildInitialFilters() {
  return mascotasConfig.listConfig.searchFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
}

function buildFilterArray(filtersState) {
  const filters = [];

  for (const field of mascotasConfig.listConfig.searchFields) {
    const value = (filtersState[field.id] ?? "").toString().trim();
    if (value) filters.push(`${field.id}:${value}`);
  }

  return filters;
}

function buildClienteOption(cliente) {
  const nombres = resolveFieldValue(cliente, "Nombres");
  const apellidos = resolveFieldValue(cliente, "Apellidos");
  const label = [nombres, apellidos].filter(Boolean).join(" ").trim() || "Sin nombre";

  return {
    value: resolveFieldValue(cliente, "IdCliente"),
    label,
    raw: cliente
  };
}

export function useMascotasList() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(mascotasConfig.listConfig.defaultTake);
  const [sort, setSort] = useState(mascotasConfig.listConfig.defaultSort);
  const [filters, setFilters] = useState(buildInitialFilters);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [toggleLoading, setToggleLoading] = useState(false);

  const activeFilters = useMemo(() => buildFilterArray(filters), [filters]);

  const loadClientes = async () => {
    const result = await clientesService.getActivos();
    setClientes(Array.isArray(result) ? result.map(buildClienteOption) : []);
  };

  const loadMascotas = async () => {
    try {
      setLoading(true);
      setError("");

      const [response] = await Promise.all([
        mascotasService.searchPaginated({
          Page: page,
          Take: take,
          Sort: sort,
          Filters: activeFilters
        }),
        loadClientes()
      ]);

      const responseData = response?.data ?? [];
      const responseMeta = response?.meta ?? response?.Meta ?? {};

      setMascotas(Array.isArray(responseData) ? responseData : []);
      setMeta({
        currentPage: responseMeta.currentPage || responseMeta.CurrentPage || page,
        totalPages: responseMeta.totalPages || responseMeta.TotalPages || 1,
        totalCount: responseMeta.totalCount || responseMeta.TotalCount || responseData.length || 0
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error cargando mascotas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMascotas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, take, sort, activeFilters.join("|")]);

  const updateFilter = (fieldId, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [fieldId]: value }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters(buildInitialFilters());
  };

  const updateTake = (value) => {
    setPage(1);
    setTake(value);
  };

  const toggleMascotaStatus = async (id) => {
    try {
      setToggleLoading(true);
      await mascotasService.toggleStatus(id);
      await loadMascotas();
    } finally {
      setToggleLoading(false);
    }
  };

  return {
    mascotas,
    clientes,
    loading,
    error,
    page,
    take,
    sort,
    meta,
    filters,
    toggleLoading,
    setPage,
    setSort,
    setTake: updateTake,
    updateFilter,
    clearFilters,
    reload: loadMascotas,
    toggleMascotaStatus
  };
}
