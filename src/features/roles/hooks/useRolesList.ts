import { useEffect, useMemo, useState } from "react";
import { rolesConfig } from "../../../config/modules";
import type { Rol } from "../../../models/entities/rol";
import rolesService from "../../../services/rolesService";

function buildInitialFilters() {
  return rolesConfig.listConfig.searchFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
}

function buildFilterArray(filtersState) {
  const filters = [];

  for (const field of rolesConfig.listConfig.searchFields) {
    const value = (filtersState[field.id] ?? "").toString().trim();
    if (value) filters.push(`${field.id}:${value}`);
  }

  return filters;
}

export function useRolesList() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(rolesConfig.listConfig.defaultTake);
  const [sort, setSort] = useState(rolesConfig.listConfig.defaultSort);
  const [filters, setFilters] = useState(buildInitialFilters);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });

  const activeFilters = useMemo(() => buildFilterArray(filters), [filters]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await rolesService.searchPaginated({
        Page: page,
        Take: take,
        Sort: sort,
        Filters: activeFilters
      });

      const responseData = response?.data ?? [];
      const responseMeta = response?.meta ?? response?.Meta ?? {};

      setRoles(Array.isArray(responseData) ? responseData : []);
      setMeta({
        currentPage: responseMeta.currentPage || responseMeta.CurrentPage || page,
        totalPages: responseMeta.totalPages || responseMeta.TotalPages || 1,
        totalCount: responseMeta.totalCount || responseMeta.TotalCount || responseData.length || 0
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error cargando roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
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
    roles,
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
    reload: loadRoles
  };
}
