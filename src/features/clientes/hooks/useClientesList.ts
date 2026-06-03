import { useEffect, useMemo, useState } from "react";
import { clientesConfig } from "../../../config/modules";
import type { Cliente } from "../../../models/entities/cliente";
import clientesService from "../../../services/clientesService";

function buildInitialFilters() {
  return clientesConfig.listConfig.searchFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
}

function buildFilterArray(filtersState) {
  const filters = [];

  for (const field of clientesConfig.listConfig.searchFields) {
    const value = (filtersState[field.id] ?? "").toString().trim();
    if (value) filters.push(`${field.id}:${value}`);
  }

  return filters;
}

export function useClientesList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(clientesConfig.listConfig.defaultTake);
  const [sort, setSort] = useState(clientesConfig.listConfig.defaultSort);
  const [filters, setFilters] = useState(buildInitialFilters);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [toggleLoading, setToggleLoading] = useState(false);

  const activeFilters = useMemo(() => buildFilterArray(filters), [filters]);

  const loadClientes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await clientesService.searchPaginated({
        Page: page,
        Take: take,
        Sort: sort,
        Filters: activeFilters
      });

      const responseData = response?.data ?? [];
      const responseMeta = response?.meta ?? response?.Meta ?? {};

      setClientes(Array.isArray(responseData) ? responseData : []);
      setMeta({
        currentPage: responseMeta.currentPage || responseMeta.CurrentPage || page,
        totalPages: responseMeta.totalPages || responseMeta.TotalPages || 1,
        totalCount: responseMeta.totalCount || responseMeta.TotalCount || responseData.length || 0
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error cargando clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
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

  const toggleClienteStatus = async (id) => {
    try {
      setToggleLoading(true);
      await clientesService.toggleStatus(id);
      await loadClientes();
    } finally {
      setToggleLoading(false);
    }
  };

  return {
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
    reload: loadClientes,
    toggleClienteStatus
  };
}
