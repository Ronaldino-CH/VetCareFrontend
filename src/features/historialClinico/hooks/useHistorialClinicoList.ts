import { useEffect, useMemo, useState } from "react";
import { historialClinicoConfig } from "../../../config/modules";
import type { HistorialClinico } from "../../../models/entities/historialClinico";
import historialClinicoService from "../../../services/historialClinicoService";
import mascotasService from "../../../services/mascotasService";
import usuariosService from "../../../services/usuariosService";
import { ROLE_IDS } from "../../../utils/constants";
import { resolveFieldValue } from "../../../utils/format";

function buildInitialFilters() {
  return historialClinicoConfig.listConfig.searchFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
}

function buildFilterArray(filtersState) {
  const filters = [];

  for (const field of historialClinicoConfig.listConfig.searchFields) {
    const value = (filtersState[field.id] ?? "").toString().trim();
    if (value) filters.push(`${field.id}:${value}`);
  }

  return filters;
}

function optionLabel(item, fields) {
  return fields
    .map((field) => resolveFieldValue(item, field))
    .filter(Boolean)
    .join(" ")
    .trim() || "Sin nombre";
}

function buildOption(item, valueField, labelFields) {
  return {
    value: resolveFieldValue(item, valueField),
    label: optionLabel(item, labelFields),
    raw: item
  };
}

export function useHistorialClinicoList() {
  const [historiales, setHistoriales] = useState<HistorialClinico[]>([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(historialClinicoConfig.listConfig.defaultTake);
  const [sort, setSort] = useState(historialClinicoConfig.listConfig.defaultSort);
  const [filters, setFilters] = useState(buildInitialFilters);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });

  const activeFilters = useMemo(() => buildFilterArray(filters), [filters]);

  const loadRelations = async () => {
    const [mascotasData, usuariosData] = await Promise.all([
      mascotasService.getActivos(),
      usuariosService.getActivos()
    ]);

    setMascotas(
      Array.isArray(mascotasData)
        ? mascotasData.map((mascota) => buildOption(mascota, "IdMascota", ["Nombre"]))
        : []
    );
    setVeterinarios(
      Array.isArray(usuariosData)
        ? usuariosData
            .filter((usuario) => String(resolveFieldValue(usuario, "IdRol")) === String(ROLE_IDS.VETERINARIO))
            .map((usuario) => buildOption(usuario, "IdUsuario", ["Nombres", "Apellidos"]))
        : []
    );
  };

  const loadHistoriales = async () => {
    try {
      setLoading(true);
      setError("");

      const [response] = await Promise.all([
        historialClinicoService.searchPaginated({
          Page: page,
          Take: take,
          Sort: sort,
          Filters: activeFilters
        }),
        loadRelations()
      ]);

      const responseData = response?.data ?? [];
      const responseMeta = response?.meta ?? response?.Meta ?? {};

      setHistoriales(Array.isArray(responseData) ? responseData : []);
      setMeta({
        currentPage: responseMeta.currentPage || responseMeta.CurrentPage || page,
        totalPages: responseMeta.totalPages || responseMeta.TotalPages || 1,
        totalCount: responseMeta.totalCount || responseMeta.TotalCount || responseData.length || 0
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error cargando historial clinico");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistoriales();
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
    historiales,
    mascotas,
    veterinarios,
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
    reload: loadHistoriales
  };
}
