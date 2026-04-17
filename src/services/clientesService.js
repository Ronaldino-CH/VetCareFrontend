import { createCrudService } from "./crudServiceFactory";

const clientesService = createCrudService("/api/Clientes", {
  hasActivos: true,
  hasToggle: true,
  hasPaginado: true
});

export default clientesService;
