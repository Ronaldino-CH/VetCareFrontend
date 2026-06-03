import { useEffect, useMemo, useState } from "react";
import { usuariosConfig } from "../../../config/modules";
import type { Usuario } from "../../../models/entities/usuario";
import rolesService from "../../../services/rolesService";
import usuariosService from "../../../services/usuariosService";
import { resolveFieldValue } from "../../../utils/format";

function buildInitialFilters() {
  return usuariosConfig.listConfig.searchFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
}

function buildFilterArray(filtersState) {
  const filters = [];

  for (const field of usuariosConfig.listConfig.searchFields) {
    const value = (filtersState[field.id] ?? "").toString().trim();
    if (value) filters.push(`${field.id}:${value}`);
  }

  return filters;
}

function buildRolOption(rol) {
  return {
    value: resolveFieldValue(rol, "IdRol"),
    label: resolveFieldValue(rol, "Nombre") || "Sin nombre",
    raw: rol
  };
}

export function useUsuariosList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(usuariosConfig.listConfig.defaultTake);
  const [sort, setSort] = useState(usuariosConfig.listConfig.defaultSort);
  const [filters, setFilters] = useState(buildInitialFilters);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [toggleLoading, setToggleLoading] = useState(false);

  const activeFilters = useMemo(() => buildFilterArray(filters), [filters]);

  const loadRoles = async () => {
    const result = await rolesService.findAll();
    setRoles(Array.isArray(result) ? result.map(buildRolOption) : []);
  };

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError("");

      const [response] = await Promise.all([
        usuariosService.searchPaginated({
          Page: page,
          Take: take,
          Sort: sort,
          Filters: activeFilters
        }),
        loadRoles()
      ]);

      const responseData = response?.data ?? [];
      const responseMeta = response?.meta ?? response?.Meta ?? {};

      setUsuarios(Array.isArray(responseData) ? responseData : []);
      setMeta({
        currentPage: responseMeta.currentPage || responseMeta.CurrentPage || page,
        totalPages: responseMeta.totalPages || responseMeta.TotalPages || 1,
        totalCount: responseMeta.totalCount || responseMeta.TotalCount || responseData.length || 0
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
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

  const toggleUsuarioStatus = async (id) => {
    try {
      setToggleLoading(true);
      await usuariosService.toggleStatus(id);
      await loadUsuarios();
    } finally {
      setToggleLoading(false);
    }
  };

  return {
    usuarios,
    roles,
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
    reload: loadUsuarios,
    toggleUsuarioStatus
  };
}
