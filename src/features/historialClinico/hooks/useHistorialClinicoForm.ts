import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type {
  CreateHistorialClinicoDto,
  UpdateHistorialClinicoDto
} from "../../../models/dto/historialClinico.dto";
import historialClinicoService from "../../../services/historialClinicoService";
import mascotasService from "../../../services/mascotasService";
import usuariosService from "../../../services/usuariosService";
import { ROLE_IDS } from "../../../utils/constants";
import { resolveFieldValue } from "../../../utils/format";

interface HistorialClinicoFormState {
  IdMascota: string;
  Diagnostico: string;
  Tratamiento: string;
  Observaciones: string;
  IdVeterinario: string;
}

type HistorialClinicoFormField = keyof HistorialClinicoFormState;

const historialFields: HistorialClinicoFormField[] = [
  "IdMascota",
  "Diagnostico",
  "Tratamiento",
  "Observaciones",
  "IdVeterinario"
];

function buildInitialState(): HistorialClinicoFormState {
  return {
    IdMascota: "",
    Diagnostico: "",
    Tratamiento: "",
    Observaciones: "",
    IdVeterinario: ""
  };
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
    label: optionLabel(item, labelFields)
  };
}

export function useHistorialClinicoForm({ id, isEdit }) {
  const [form, setForm] = useState<HistorialClinicoFormState>(buildInitialState);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(Boolean(isEdit));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialState = useMemo(() => buildInitialState(), []);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  useEffect(() => {
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

    loadRelations();
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;

    const loadHistorial = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await historialClinicoService.findById(id);
        const nextForm = { ...initialState };

        for (const field of historialFields) {
          const value = resolveFieldValue(data, field);
          nextForm[field] = value === null || value === undefined ? "" : String(value);
        }

        setForm(nextForm);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Error cargando historial clinico");
      } finally {
        setLoading(false);
      }
    };

    loadHistorial();
  }, [id, initialState, isEdit]);

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: CreateHistorialClinicoDto | UpdateHistorialClinicoDto = {
        IdMascota: Number.parseInt(form.IdMascota, 10),
        Diagnostico: form.Diagnostico,
        Tratamiento: form.Tratamiento,
        Observaciones: form.Observaciones,
        IdVeterinario: Number.parseInt(form.IdVeterinario, 10)
      };

      const response = isEdit
        ? await historialClinicoService.update(id, payload)
        : await historialClinicoService.create(payload);

      setSuccess(response?.message || "Guardado correctamente");
      return true;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        err?.message ||
        "No se pudo guardar";
      setError(message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    mascotas,
    veterinarios,
    loading,
    saving,
    error,
    success,
    onChange,
    submit
  };
}
