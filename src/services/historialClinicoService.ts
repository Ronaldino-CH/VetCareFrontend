import { createCrudService } from "./crudServiceFactory";

const historialClinicoService = createCrudService("/api/HistorialClinico", {
  hasActivos: false,
  hasToggle: false,
  hasPaginado: true
});

export default historialClinicoService;
