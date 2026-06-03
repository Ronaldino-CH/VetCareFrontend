export interface CreateClienteDto {
  Nombres: string;
  Apellidos: string;
  Documento: string;
  Telefono?: string;
  Correo?: string;
  Direccion?: string;
}

export interface UpdateClienteDto extends CreateClienteDto {}
