import { createCrudService } from "./crudServiceFactory";

const usuariosService = createCrudService("/api/Usuarios", {
  hasActivos: true,
  hasToggle: true,
  hasPaginado: true
});

export default usuariosService;
