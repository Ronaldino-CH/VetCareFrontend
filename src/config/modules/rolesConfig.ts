import { ROLE_IDS } from "../../utils/constants";

export const rolesConfig = {
  key: "roles",
  title: "Roles",
  basePath: "/roles",
  idField: "IdRol",
  roleAccess: {
    list: [ROLE_IDS.ADMIN],
    create: [ROLE_IDS.ADMIN],
    edit: [ROLE_IDS.ADMIN],
    toggle: []
  },
  columns: [
    { field: "IdRol", label: "ID" },
    { field: "Nombre", label: "Nombre" }
  ],
  listConfig: {
    defaultSort: "nombre.asc",
    defaultTake: 6,
    searchFields: [{ id: "nombre", label: "Nombre", type: "text", placeholder: "Buscar rol" }]
  },
  formFields: [{ name: "Nombre", label: "Nombre", type: "text", required: true }]
};
