import { ROLE_IDS } from "../../utils/constants";

export const mascotasConfig = {
  key: "mascotas",
  title: "Mascotas",
  basePath: "/mascotas",
  idField: "IdMascota",
  statusField: "EstadoMascota",
  roleAccess: {
    list: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA],
    create: [ROLE_IDS.ADMIN, ROLE_IDS.RECEPCIONISTA],
    edit: [ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA],
    toggle: [ROLE_IDS.ADMIN, ROLE_IDS.RECEPCIONISTA]
  },
  relations: {
    clientes: {
      sourceModule: "clientes",
      method: "getActivos",
      valueField: "IdCliente",
      labelFields: ["Nombres", "Apellidos"]
    }
  },
  columns: [
    { field: "IdMascota", label: "ID" },
    { field: "Nombre", label: "Nombre" },
    { field: "Especie", label: "Especie" },
    { field: "Raza", label: "Raza" },
    { field: "Sexo", label: "Sexo" },
    { field: "FechaNacimiento", label: "Nacimiento" },
    { field: "Peso", label: "Peso" },
    { field: "Color", label: "Color" },
    { field: "IdCliente", label: "Cliente", relationKey: "clientes" },
    { field: "EstadoMascota", label: "Estado", type: "status" }
  ],
  listConfig: {
    defaultSort: "nombres.asc",
    defaultTake: 6,
    searchFields: [
      { id: "nombres", label: "Nombre", type: "text", placeholder: "Buscar por nombre" },
      { id: "estadoMascota", label: "Estado", type: "status" }
    ]
  },
  formFields: [
    { name: "Nombre", label: "Nombre", type: "text", required: true },
    { name: "Especie", label: "Especie", type: "text", required: true },
    { name: "Raza", label: "Raza", type: "text", required: false },
    { name: "Sexo", label: "Sexo", type: "text", required: false },
    { name: "FechaNacimiento", label: "Fecha de nacimiento", type: "date", required: true },
    { name: "Peso", label: "Peso", type: "number", required: false, parser: "float" },
    { name: "Color", label: "Color", type: "text", required: false },
    {
      name: "IdCliente",
      label: "Cliente",
      type: "select",
      required: true,
      parser: "int",
      relationKey: "clientes"
    }
  ]
};
