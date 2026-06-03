import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { CreateMascotaDto, UpdateMascotaDto } from "../../../models/dto/mascota.dto";
import clientesService from "../../../services/clientesService";
import mascotasService from "../../../services/mascotasService";
import { resolveFieldValue } from "../../../utils/format";

interface MascotaFormState {
  Nombre: string;
  Especie: string;
  Raza: string;
  Sexo: string;
  FechaNacimiento: string;
  Peso: string;
  Color: string;
  IdCliente: string;
}

type MascotaFormField = keyof MascotaFormState;

const mascotaFields: MascotaFormField[] = [
  "Nombre",
  "Especie",
  "Raza",
  "Sexo",
  "FechaNacimiento",
  "Peso",
  "Color",
  "IdCliente"
];

function buildInitialState(): MascotaFormState {
  return {
    Nombre: "",
    Especie: "",
    Raza: "",
    Sexo: "",
    FechaNacimiento: "",
    Peso: "",
    Color: "",
    IdCliente: ""
  };
}

function buildClienteOption(cliente) {
  const nombres = resolveFieldValue(cliente, "Nombres");
  const apellidos = resolveFieldValue(cliente, "Apellidos");
  const label = [nombres, apellidos].filter(Boolean).join(" ").trim() || "Sin nombre";

  return {
    value: resolveFieldValue(cliente, "IdCliente"),
    label
  };
}

export function useMascotaForm({ id, isEdit }) {
  const [form, setForm] = useState<MascotaFormState>(buildInitialState);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(Boolean(isEdit));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialState = useMemo(() => buildInitialState(), []);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  useEffect(() => {
    const loadClientes = async () => {
      const result = await clientesService.getActivos();
      setClientes(Array.isArray(result) ? result.map(buildClienteOption) : []);
    };

    loadClientes();
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;

    const loadMascota = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await mascotasService.findById(id);
        const nextForm = { ...initialState };

        for (const field of mascotaFields) {
          const value = resolveFieldValue(data, field);
          if (field === "FechaNacimiento" && value) {
            nextForm[field] = String(value).slice(0, 10);
          } else {
            nextForm[field] = value === null || value === undefined ? "" : String(value);
          }
        }

        setForm(nextForm);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Error cargando mascota");
      } finally {
        setLoading(false);
      }
    };

    loadMascota();
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

      const payload: CreateMascotaDto | UpdateMascotaDto = {
        Nombre: form.Nombre,
        Especie: form.Especie,
        Raza: form.Raza,
        Sexo: form.Sexo,
        FechaNacimiento: form.FechaNacimiento,
        Peso: form.Peso === "" ? "" : Number.parseFloat(form.Peso),
        Color: form.Color,
        IdCliente: Number.parseInt(form.IdCliente, 10)
      };

      const response = isEdit ? await mascotasService.update(id, payload) : await mascotasService.create(payload);

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
    clientes,
    loading,
    saving,
    error,
    success,
    onChange,
    submit
  };
}
