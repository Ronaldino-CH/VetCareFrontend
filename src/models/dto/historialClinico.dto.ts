export interface CreateHistorialClinicoDto {
  IdMascota: number;
  Diagnostico: string;
  Tratamiento: string;
  Observaciones?: string;
  IdVeterinario: number;
}

export interface UpdateHistorialClinicoDto extends CreateHistorialClinicoDto {}
