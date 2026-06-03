export interface Cita {
  IdCita: number;
  Motivo: string;
  Observaciones?: string;
  IdMascota: number;
  IdVeterinario: number;
  IdEstadoCita: number;
  FechaHora: string;
  FechaCrea?: string;
}
