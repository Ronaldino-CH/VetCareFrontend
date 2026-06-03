import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { ROLE_IDS } from "../../../utils/constants";
import type { CreateCitaDto, UpdateCitaDto } from "../../../models/dto/cita.dto";
import citasService from "../../../services/citasService";
import estadoCitasService from "../../../services/estadoCitasService";
import mascotasService from "../../../services/mascotasService";
import usuariosService from "../../../services/usuariosService";
import { formatDateForInput, resolveFieldValue } from "../../../utils/format";

interface CitaFormState {
  Motivo: string;
  Observaciones: string;
  IdMascota: string;
  IdVeterinario: string;
  IdEstadoCita: string;
  FechaHora: string;
}

type CitaFormField = keyof CitaFormState;

const citaFields: CitaFormField[] = [
  "Motivo",
  "Observaciones",
  "IdMascota",
  "IdVeterinario",
  "IdEstadoCita",
  "FechaHora"
];

function buildInitialState(): CitaFormState {
  return {
    Motivo: "",
    Observaciones: "",
    IdMascota: "",
    IdVeterinario: "",
    IdEstadoCita: "",
    FechaHora: ""
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

export function useCitaForm({ id, isEdit }) {
  const [form, setForm] = useState<CitaFormState>(buildInitialState);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [estadoCitas, setEstadoCitas] = useState([]);
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

    loadRelations();
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;

    const loadCita = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await citasService.findById(id);
        const nextForm = { ...initialState };

        for (const field of citaFields) {
          const value = resolveFieldValue(data, field);
          if (field === "FechaHora") {
            nextForm[field] = formatDateForInput(value);
          } else {
            nextForm[field] = value === null || value === undefined ? "" : String(value);
          }
        }

        setForm(nextForm);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Error cargando cita");
      } finally {
        setLoading(false);
      }
    };

    loadCita();
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

      const payload: CreateCitaDto | UpdateCitaDto = {
        Motivo: form.Motivo,
        Observaciones: form.Observaciones,
        IdMascota: Number.parseInt(form.IdMascota, 10),
        IdVeterinario: Number.parseInt(form.IdVeterinario, 10),
        IdEstadoCita: Number.parseInt(form.IdEstadoCita, 10),
        FechaHora: form.FechaHora
      };

      const response = isEdit ? await citasService.update(id, payload) : await citasService.create(payload);

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
    estadoCitas,
    loading,
    saving,
    error,
    success,
    onChange,
    submit
  };
}
