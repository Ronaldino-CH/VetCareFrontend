import { clientesConfig } from "../config/modules/clientesConfig";
import { mascotasConfig } from "../config/modules/mascotasConfig";
import { citasConfig } from "../config/modules/citasConfig";
import { estadoCitasConfig } from "../config/modules/estadoCitasConfig";
import { rolesConfig } from "../config/modules/rolesConfig";
import { usuariosConfig } from "../config/modules/usuariosConfig";
import { historialClinicoConfig } from "../config/modules/historialClinicoConfig";
import { chatGeneralConfig } from "../config/modules/chatGeneralConfig";

export const modulesConfig = {
  clientes: clientesConfig,
  mascotas: mascotasConfig,
  citas: citasConfig,
  estadoCitas: estadoCitasConfig,
  roles: rolesConfig,
  usuarios: usuariosConfig,
  historialClinico: historialClinicoConfig,
  chatGeneral: chatGeneralConfig
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
