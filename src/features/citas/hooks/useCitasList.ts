import { useEffect, useMemo, useState } from "react";
import { ROLE_IDS } from "../../../utils/constants";
import { citasConfig } from "../../../config/modules";
import type { Cita } from "../../../models/entities/cita";
import citasService from "../../../services/citasService";
import estadoCitasService from "../../../services/estadoCitasService";
import mascotasService from "../../../services/mascotasService";
import usuariosService from "../../../services/usuariosService";
import { resolveFieldValue } from "../../../utils/format";

function buildInitialFilters() {
  return citasConfig.listConfig.searchFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
}

function buildFilterArray(filtersState) {
  const filters = [];

  for (const field of citasConfig.listConfig.searchFields) {
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

export function useCitasList() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [estadoCitas, setEstadoCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(citasConfig.listConfig.defaultTake);
  const [sort, setSort] = useState(citasConfig.listConfig.defaultSort);
  const [filters, setFilters] = useState(buildInitialFilters);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });

  const activeFilters = useMemo(() => buildFilterArray(filters), [filters]);

  const loadRelations = async () => {
    const [mascotasData, usuariosData, estadosData] = await Promise.all([
      mascotasService.getActivos(),
      usuariosService.getActivos(),
      estadoCitasService.findAll()
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
    setEstadoCitas(
      Array.isArray(estadosData)
        ? estadosData.map((estado) => buildOption(estado, "IdEstadoCita", ["NombreEstado"]))
        : []
    );
  };

  const loadCitas = async () => {
    try {
      setLoading(true);
      setError("");

      const [response] = await Promise.all([
        citasService.searchPaginated({
          Page: page,
          Take: take,
          Sort: sort,
          Filters: activeFilters
        }),
        loadRelations()
      ]);

      const responseData = response?.data ?? [];
      const responseMeta = response?.meta ?? response?.Meta ?? {};

      setCitas(Array.isArray(responseData) ? responseData : []);
      setMeta({
        currentPage: responseMeta.currentPage || responseMeta.CurrentPage || page,
        totalPages: responseMeta.totalPages || responseMeta.TotalPages || 1,
        totalCount: responseMeta.totalCount || responseMeta.TotalCount || responseData.length || 0
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error cargando citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitas();
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
    citas,
    mascotas,
    veterinarios,
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
    reload: loadCitas
  };
}
