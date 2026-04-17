import { createCrudService } from "./crudServiceFactory";

const estadoCitasService = createCrudService("/api/EstadoCitas", {
  hasActivos: false,
  hasToggle: false,
  hasPaginado: true
});

export default estadoCitasService;
