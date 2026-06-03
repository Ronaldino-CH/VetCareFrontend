import { ROLE_IDS } from "../../utils/constants";

export const estadoCitasConfig = {
  key: "estadoCitas",
  title: "Estado de Citas",
  basePath: "/estado-citas",
  idField: "IdEstadoCita",
  roleAccess: {
    list: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA],
    create: [ROLE_IDS.ADMIN],
    edit: [ROLE_IDS.ADMIN],
    toggle: []
  },
  columns: [
    { field: "IdEstadoCita", label: "ID" },
    { field: "NombreEstado", label: "Nombre", type: "tag" },
    { field: "Codigo", label: "Codigo" }
  ],
  listConfig: {
    defaultSort: "nombreEstado.asc",
    defaultTake: 6,
    searchFields: [{ id: "nombreEstado", label: "Nombre", type: "text", placeholder: "Buscar por nombre" }]
  },
  formFields: [
    { name: "NombreEstado", label: "Nombre estado", type: "text", required: true },
    { name: "Codigo", label: "Codigo", type: "text", required: false }
  ]
};
