import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { CreateRolDto, UpdateRolDto } from "../../../models/dto/rol.dto";
import rolesService from "../../../services/rolesService";
import { resolveFieldValue } from "../../../utils/format";

type RolFormState = CreateRolDto;
type RolFormField = keyof RolFormState;

const rolFields: RolFormField[] = ["Nombre"];

function buildInitialState(): RolFormState {
  return {
    Nombre: ""
  };
}

export function useRolForm({ id, isEdit }) {
  const [form, setForm] = useState<RolFormState>(buildInitialState);
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

    const loadRol = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await rolesService.findById(id);
        const nextForm = { ...initialState };

        for (const field of rolFields) {
          nextForm[field] = resolveFieldValue(data, field) ?? "";
        }

        setForm(nextForm);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Error cargando rol");
      } finally {
        setLoading(false);
      }
    };

    loadRol();
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

      const payload: CreateRolDto | UpdateRolDto = {
        Nombre: form.Nombre
      };

      const response = isEdit ? await rolesService.update(id, payload) : await rolesService.create(payload);

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
