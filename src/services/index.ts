import clientesService from "./clientesService";
import mascotasService from "./mascotasService";
import citasService from "./citasService";
import estadoCitasService from "./estadoCitasService";
import rolesService from "./rolesService";
import usuariosService from "./usuariosService";
import historialClinicoService from "./historialClinicoService";
import authService from "./authService";
import chatGeneralService from "./chatGeneralService";

export const moduleServices = {
  clientes: clientesService,
  mascotas: mascotasService,
  citas: citasService,
  estadoCitas: estadoCitasService,
  roles: rolesService,
  usuarios: usuariosService,
  historialClinico: historialClinicoService,
  chatGeneral: chatGeneralService
};

export { authService, chatGeneralService };
