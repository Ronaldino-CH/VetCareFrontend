import { ROLE_IDS } from "../../utils/constants";

export const citasConfig = {
  key: "citas",
  title: "Citas",
  basePath: "/citas",
  idField: "IdCita",
  roleAccess: {
    list: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA],
    create: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA],
    edit: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA],
    toggle: []
  },
  relations: {
    mascotas: {
      sourceModule: "mascotas",
      method: "getActivos",
      valueField: "IdMascota",
      labelFields: ["Nombre"]
    },
    veterinarios: {
      sourceModule: "usuarios",
      method: "getActivos",
      valueField: "IdUsuario",
      labelFields: ["Nombres", "Apellidos"],
      filterField: "IdRol",
      filterEquals: ROLE_IDS.VETERINARIO
    },
    estadoCitas: {
      sourceModule: "estadoCitas",
      method: "findAll",
      valueField: "IdEstadoCita",
      labelFields: ["NombreEstado"]
    }
  },
  columns: [
    { field: "IdCita", label: "ID" },
    { field: "Motivo", label: "Motivo" },
    { field: "Observaciones", label: "Observaciones" },
    { field: "IdMascota", label: "Mascota", relationKey: "mascotas" },
    { field: "IdVeterinario", label: "Veterinario", relationKey: "veterinarios" },
    { field: "IdEstadoCita", label: "Estado cita", relationKey: "estadoCitas", type: "tag" },
    { field: "FechaHora", label: "Fecha y hora" }
  ],
  listConfig: {
    defaultSort: "motivo.asc",
    defaultTake: 6,
    searchFields: [
      { id: "mascota", label: "Mascota", type: "text", placeholder: "Buscar por mascota" },
      { id: "idEstadoCita", label: "Estado cita", type: "select", relationKey: "estadoCitas" }
    ]
  },
  formFields: [
    { name: "Motivo", label: "Motivo", type: "text", required: true },
    { name: "Observaciones", label: "Observaciones", type: "text", required: false },
    {
      name: "IdMascota",
      label: "Mascota",
      type: "select",
      required: true,
      parser: "int",
      relationKey: "mascotas"
    },
    {
      name: "IdVeterinario",
      label: "Veterinario",
      type: "select",
      required: true,
      parser: "int",
      relationKey: "veterinarios"
    },
    {
      name: "IdEstadoCita",
      label: "Estado cita",
      type: "select",
      required: true,
      parser: "int",
      relationKey: "estadoCitas"
    },
    { name: "FechaHora", label: "Fecha y hora", type: "datetime-local", required: true }
  ]
};
