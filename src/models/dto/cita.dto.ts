export interface CreateCitaDto {
  Motivo: string;
  Observaciones?: string;
  IdMascota: number;
  IdVeterinario: number;
  IdEstadoCita: number;
  FechaHora: string;
}

export interface UpdateCitaDto extends CreateCitaDto {}
