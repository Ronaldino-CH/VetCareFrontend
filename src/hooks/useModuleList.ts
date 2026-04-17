import { useEffect, useMemo, useState } from "react";

function buildInitialFilters(searchFields = []) {
  return searchFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
}

function buildFilterArray(searchFields = [], filtersState = {}) {
  const filters = [];

  for (const field of searchFields) {
    const value = (filtersState[field.id] ?? "").toString().trim();
    if (!value) continue;
    filters.push(`${field.id}:${value}`);
  }

  return filters;
}

export function useModuleList(service, config) {
  const listConfig = config.listConfig || {};
  const searchFields = listConfig.searchFields || [];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(listConfig.defaultTake || 6);
  const [sort, setSort] = useState(listConfig.defaultSort || "");
  const [filters, setFilters] = useState(buildInitialFilters(searchFields));
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });

  const activeFilters = useMemo(() => buildFilterArray(searchFields, filters), [filters, searchFields]);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await service.searchPaginated({
        Page: page,
        Take: take,
        Sort: sort,
        Filters: activeFilters
      });

      const responseData = response?.data ?? [];
      const responseMeta = response?.meta ?? response?.Meta ?? {};

      setItems(Array.isArray(responseData) ? responseData : []);
      setMeta({
        currentPage: responseMeta.currentPage || responseMeta.CurrentPage || page,
        totalPages: responseMeta.totalPages || responseMeta.TotalPages || 1,
        totalCount: responseMeta.totalCount || responseMeta.TotalCount || responseData.length || 0
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, take, sort, activeFilters.join("|")]);

  const updateFilter = (fieldId, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [fieldId]: value }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters(buildInitialFilters(searchFields));
  };

  const updateTake = (value) => {
    setPage(1);
    setTake(value);
  };

  const updateSort = (value) => {
    setPage(1);
    setSort(value);
  };

  return {
    items,
    loading,
    error,
    page,
    take,
    sort,
    meta,
    filters,
    searchFields,
    setPage,
    setTake: updateTake,
    setSort: updateSort,
    updateFilter,
    clearFilters,
    reload: load
  };
}
