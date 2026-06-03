import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { CreateUsuarioDto, UpdateUsuarioDto } from "../../../models/dto/usuario.dto";
import rolesService from "../../../services/rolesService";
import usuariosService from "../../../services/usuariosService";
import { resolveFieldValue } from "../../../utils/format";

interface UsuarioFormState {
  UserName: string;
  PasswordHash: string;
  Nombres: string;
  Apellidos: string;
  IdRol: string;
}

type UsuarioFormField = keyof UsuarioFormState;

const usuarioFields: UsuarioFormField[] = ["UserName", "PasswordHash", "Nombres", "Apellidos", "IdRol"];

function buildInitialState(): UsuarioFormState {
  return {
    UserName: "",
    PasswordHash: "",
    Nombres: "",
    Apellidos: "",
    IdRol: ""
  };
}

function buildRolOption(rol) {
  return {
    value: resolveFieldValue(rol, "IdRol"),
    label: resolveFieldValue(rol, "Nombre") || "Sin nombre"
  };
}

export function useUsuarioForm({ id, isEdit }) {
  const [form, setForm] = useState<UsuarioFormState>(buildInitialState);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(Boolean(isEdit));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialState = useMemo(() => buildInitialState(), []);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  useEffect(() => {
    const loadRoles = async () => {
      const result = await rolesService.findAll();
      setRoles(Array.isArray(result) ? result.map(buildRolOption) : []);
    };

    loadRoles();
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;

    const loadUsuario = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await usuariosService.findById(id);
        const nextForm = { ...initialState };

        for (const field of usuarioFields) {
          const value = resolveFieldValue(data, field);
          nextForm[field] = value === null || value === undefined ? "" : String(value);
        }

        setForm(nextForm);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Error cargando usuario");
      } finally {
        setLoading(false);
      }
    };

    loadUsuario();
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

      const payload: CreateUsuarioDto | UpdateUsuarioDto = {
        UserName: form.UserName,
        PasswordHash: form.PasswordHash,
        Nombres: form.Nombres,
        Apellidos: form.Apellidos,
        IdRol: Number.parseInt(form.IdRol, 10)
      };

      const response = isEdit ? await usuariosService.update(id, payload) : await usuariosService.create(payload);

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
    roles,
    loading,
    saving,
    error,
    success,
    onChange,
    submit
  };
}
