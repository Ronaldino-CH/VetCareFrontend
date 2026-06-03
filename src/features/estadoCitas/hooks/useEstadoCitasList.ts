import { useEffect, useMemo, useState } from "react";
import { estadoCitasConfig } from "../../../config/modules";
import type { EstadoCita } from "../../../models/entities/estadoCita";
import estadoCitasService from "../../../services/estadoCitasService";

function buildInitialFilters() {
  return estadoCitasConfig.listConfig.searchFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
}

function buildFilterArray(filtersState) {
  const filters = [];

  for (const field of estadoCitasConfig.listConfig.searchFields) {
    const value = (filtersState[field.id] ?? "").toString().trim();
    if (value) filters.push(`${field.id}:${value}`);
  }

  return filters;
}

export function useEstadoCitasList() {
  const [estadoCitas, setEstadoCitas] = useState<EstadoCita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(estadoCitasConfig.listConfig.defaultTake);
  const [sort, setSort] = useState(estadoCitasConfig.listConfig.defaultSort);
  const [filters, setFilters] = useState(buildInitialFilters);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });

  const activeFilters = useMemo(() => buildFilterArray(filters), [filters]);

  const loadEstadoCitas = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await estadoCitasService.searchPaginated({
        Page: page,
        Take: take,
        Sort: sort,
        Filters: activeFilters
      });

      const responseData = response?.data ?? [];
      const responseMeta = response?.meta ?? response?.Meta ?? {};

      setEstadoCitas(Array.isArray(responseData) ? responseData : []);
      setMeta({
        currentPage: responseMeta.currentPage || responseMeta.CurrentPage || page,
        totalPages: responseMeta.totalPages || responseMeta.TotalPages || 1,
        totalCount: responseMeta.totalCount || responseMeta.TotalCount || responseData.length || 0
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error cargando estados de citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstadoCitas();
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

  return {
    estadoCitas,
    loading,
    error,
    page,
    take,
    sort,
    meta,
    filters,
    setPage,
    setSort,
    setTake: updateTake,
    updateFilter,
    clearFilters,
    reload: loadEstadoCitas
  };
}
