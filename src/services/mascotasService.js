import { createCrudService } from "./crudServiceFactory";

const mascotasService = createCrudService("/api/Mascotas", {
  hasActivos: true,
  hasToggle: true,
  hasPaginado: true
});

export default mascotasService;
