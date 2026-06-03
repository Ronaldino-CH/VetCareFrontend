import { ROLE_IDS } from "../../utils/constants";

export const historialClinicoConfig = {
  key: "historialClinico",
  title: "Historial Clinico",
  basePath: "/historial-clinico",
  idField: "IdHistorial",
  roleAccess: {
    list: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA],
    create: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO],
    edit: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO],
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
    }
  },
  columns: [
    { field: "IdHistorial", label: "ID" },
    { field: "IdMascota", label: "Mascota", relationKey: "mascotas" },
    { field: "Diagnostico", label: "Diagnostico" },
    { field: "Tratamiento", label: "Tratamiento" },
    { field: "Observaciones", label: "Observaciones" },
    { field: "IdVeterinario", label: "Veterinario", relationKey: "veterinarios" },
    { field: "FechaCrea", label: "Fecha y Hora" }
  ],
  listConfig: {
    defaultSort: "diagnostico.asc",
    defaultTake: 6,
    searchFields: [
      { id: "mascota", label: "Mascota", type: "text", placeholder: "Buscar por mascota" },
      { id: "diagnostico", label: "Diagnostico", type: "text", placeholder: "Buscar diagnostico" },
      { id: "tratamiento", label: "Tratamiento", type: "text", placeholder: "Buscar tratamiento" }
    ]
  },
  formFields: [
    { name: "IdMascota", label: "Mascota", type: "select", required: true, parser: "int", relationKey: "mascotas" },
    { name: "Diagnostico", label: "Diagnostico", type: "text", required: true },
    { name: "Tratamiento", label: "Tratamiento", type: "text", required: true },
    { name: "Observaciones", label: "Observaciones", type: "text", required: false },
    {
      name: "IdVeterinario",
      label: "Veterinario",
      type: "select",
      required: true,
      parser: "int",
      relationKey: "veterinarios"
    }
  ]
};
