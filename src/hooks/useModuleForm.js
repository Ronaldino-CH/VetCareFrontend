import { useEffect, useMemo, useState } from "react";
import { formatDateForInput, resolveFieldValue } from "../utils/format";

function parseFieldValue(value, parser) {
  if (value === "" || value === null || value === undefined) return value;
  if (parser === "int") return Number.parseInt(value, 10);
  if (parser === "float") return Number.parseFloat(value);
  return value;
}

function buildInitialState(formFields) {
  return formFields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});
}

export function useModuleForm({ service, formFields, id, isEdit }) {
  const [form, setForm] = useState(buildInitialState(formFields));
  const [loading, setLoading] = useState(Boolean(isEdit));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialState = useMemo(() => buildInitialState(formFields), [formFields]);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  useEffect(() => {
    if (!isEdit || !id) return;

    const loadById = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await service.findById(id);
        const newState = { ...initialState };

        for (const field of formFields) {
          const rawValue = resolveFieldValue(data, field.name);
          if (field.type === "datetime-local") {
            newState[field.name] = formatDateForInput(rawValue);
          } else if (field.type === "date" && rawValue) {
            newState[field.name] = String(rawValue).slice(0, 10);
          } else {
            newState[field.name] = rawValue ?? "";
          }
        }

        setForm(newState);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Error cargando registro");
      } finally {
        setLoading(false);
      }
    };

    loadById();
  }, [formFields, id, initialState, isEdit, service]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {};
      for (const field of formFields) {
        payload[field.name] = parseFieldValue(form[field.name], field.parser);
      }

      const response = isEdit ? await service.update(id, payload) : await service.create(payload);

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
