import { ROLE_IDS } from "../../utils/constants";

export const clientesConfig = {
  key: "clientes",
  title: "Clientes",
  basePath: "/clientes",
  idField: "IdCliente",
  statusField: "EstadoCliente",
  roleAccess: {
    list: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA],
    create: [ROLE_IDS.ADMIN, ROLE_IDS.RECEPCIONISTA],
    edit: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA],
    toggle: [ROLE_IDS.ADMIN, ROLE_IDS.RECEPCIONISTA]
  },
  columns: [
    { field: "IdCliente", label: "ID" },
    { field: "Nombres", label: "Nombres" },
    { field: "Apellidos", label: "Apellidos" },
    { field: "Documento", label: "Documento" },
    { field: "Telefono", label: "Telefono" },
    { field: "Correo", label: "Correo" },
    { field: "EstadoCliente", label: "Estado", type: "status" }
  ],
  listConfig: {
    defaultSort: "nombres.asc",
    defaultTake: 6,
    searchFields: [
      { id: "nombres", label: "Nombres", type: "text", placeholder: "Buscar por nombres" },
      { id: "estadoCliente", label: "Estado", type: "status" }
    ]
  },
  formFields: [
    { name: "Nombres", label: "Nombres", type: "text", required: true },
    { name: "Apellidos", label: "Apellidos", type: "text", required: true },
    { name: "Documento", label: "Documento", type: "text", required: true },
    { name: "Telefono", label: "Telefono", type: "text", required: false },
    { name: "Correo", label: "Correo", type: "email", required: false },
    { name: "Direccion", label: "Direccion", type: "text", required: false }
  ]
};
