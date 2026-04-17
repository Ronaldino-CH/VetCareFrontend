import { createCrudService } from "./crudServiceFactory";

const citasService = createCrudService("/api/Citas", {
  hasActivos: false,
  hasToggle: false,
  hasPaginado: true
});

export default citasService;
