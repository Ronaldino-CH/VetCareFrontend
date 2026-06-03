export interface HistorialClinico {
  IdHistorial: number;
  IdMascota: number;
  Diagnostico: string;
  Tratamiento: string;
  Observaciones?: string;
  IdVeterinario: number;
  FechaCrea?: string;
}
