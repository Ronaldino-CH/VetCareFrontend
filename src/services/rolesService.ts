import { createCrudService } from "./crudServiceFactory";

const rolesService = createCrudService("/api/Roles", {
  hasActivos: false,
  hasToggle: false,
  hasPaginado: true
});

export default rolesService;
