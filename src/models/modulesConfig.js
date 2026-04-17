import { ROLE_IDS } from "../utils/constants";

export const modulesConfig = {
  clientes: {
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
  },
  mascotas: {
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
  },
  citas: {
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
  },
  estadoCitas: {
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
  },
  roles: {
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
  },
  usuarios: {
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
  },
  historialClinico: {
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
  }
};

export function canAccess(roleId, action, moduleKey) {
  const module = modulesConfig[moduleKey];
  if (!module?.roleAccess) return false;

  const allowedRoles = module.roleAccess[action] || [];
  return allowedRoles.includes(roleId);
}

export function getModulesMenuByRole(roleId) {
  return Object.values(modulesConfig)
    .filter((module) => canAccess(roleId, "list", module.key))
    .map((module) => ({
      key: module.key,
      title: module.title,
      path: module.basePath
    }));
}
