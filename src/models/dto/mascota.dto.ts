export interface CreateMascotaDto {
  Nombre: string;
  Especie: string;
  Raza?: string;
  Sexo?: string;
  FechaNacimiento: string;
  Peso?: number | "";
  Color?: string;
  IdCliente: number;
}

export interface UpdateMascotaDto extends CreateMascotaDto {}
