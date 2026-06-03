import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { CreateEstadoCitaDto, UpdateEstadoCitaDto } from "../../../models/dto/estadoCita.dto";
import estadoCitasService from "../../../services/estadoCitasService";
import { resolveFieldValue } from "../../../utils/format";

type EstadoCitaFormState = CreateEstadoCitaDto;
type EstadoCitaFormField = keyof EstadoCitaFormState;

const estadoCitaFields: EstadoCitaFormField[] = ["NombreEstado", "Codigo"];

function buildInitialState(): EstadoCitaFormState {
  return {
    NombreEstado: "",
    Codigo: ""
  };
}

export function useEstadoCitaForm({ id, isEdit }) {
  const [form, setForm] = useState<EstadoCitaFormState>(buildInitialState);
  const [loading, setLoading] = useState(Boolean(isEdit));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialState = useMemo(() => buildInitialState(), []);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  useEffect(() => {
    if (!isEdit || !id) return;

    const loadEstadoCita = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await estadoCitasService.findById(id);
        const nextForm = { ...initialState };

        for (const field of estadoCitaFields) {
          nextForm[field] = resolveFieldValue(data, field) ?? "";
        }

        setForm(nextForm);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Error cargando estado de cita");
      } finally {
        setLoading(false);
      }
    };

    loadEstadoCita();
  }, [id, initialState, isEdit]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: CreateEstadoCitaDto | UpdateEstadoCitaDto = {
        NombreEstado: form.NombreEstado,
        Codigo: form.Codigo
      };

      const response = isEdit ? await estadoCitasService.update(id, payload) : await estadoCitasService.create(payload);

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
    loading,
    saving,
    error,
    success,
    onChange,
    submit
  };
}
