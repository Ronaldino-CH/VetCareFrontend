import { ROLE_IDS } from "../../utils/constants";

export const usuariosConfig = {
  key: "usuarios",
  title: "Usuarios",
  basePath: "/usuarios",
  idField: "IdUsuario",
  statusField: "EstadoUsuario",
  roleAccess: {
    list: [ROLE_IDS.ADMIN],
    create: [ROLE_IDS.ADMIN],
    edit: [ROLE_IDS.ADMIN],
    toggle: [ROLE_IDS.ADMIN]
  },
  relations: {
    roles: {
      sourceModule: "roles",
      method: "findAll",
      valueField: "IdRol",
      labelFields: ["Nombre"]
    }
  },
  columns: [
    { field: "IdUsuario", label: "ID" },
    { field: "UserName", label: "Usuario" },
    { field: "Nombres", label: "Nombres" },
    { field: "Apellidos", label: "Apellidos" },
    { field: "IdRol", label: "Rol", relationKey: "roles" },
    { field: "EstadoUsuario", label: "Estado", type: "status" }
  ],
  listConfig: {
    defaultSort: "userName.asc",
    defaultTake: 6,
    searchFields: [
      { id: "userName", label: "Usuario", type: "text", placeholder: "Buscar por usuario" },
      { id: "nombres", label: "Nombres", type: "text", placeholder: "Buscar por nombres" },
      { id: "estadoUsuario", label: "Estado", type: "status" }
    ]
  },
  formFields: [
    { name: "UserName", label: "Usuario", type: "text", required: true },
    { name: "PasswordHash", label: "Password", type: "password", required: true },
    { name: "Nombres", label: "Nombres", type: "text", required: true },
    { name: "Apellidos", label: "Apellidos", type: "text", required: true },
    { name: "IdRol", label: "Rol", type: "select", required: true, parser: "int", relationKey: "roles" }
  ]
};
