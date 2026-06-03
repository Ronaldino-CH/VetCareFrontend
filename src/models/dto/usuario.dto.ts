export interface CreateUsuarioDto {
  UserName: string;
  PasswordHash: string;
  Nombres: string;
  Apellidos: string;
  IdRol: number;
}

export interface UpdateUsuarioDto extends CreateUsuarioDto {}
