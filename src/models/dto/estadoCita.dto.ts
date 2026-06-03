export interface CreateEstadoCitaDto {
  NombreEstado: string;
  Codigo?: string;
}

export interface UpdateEstadoCitaDto extends CreateEstadoCitaDto {}
