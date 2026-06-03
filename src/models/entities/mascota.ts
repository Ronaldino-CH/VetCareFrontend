export interface Mascota {
  IdMascota: number;
  Nombre: string;
  Especie: string;
  Raza?: string;
  Sexo?: string;
  FechaNacimiento: string;
  Peso?: number;
  Color?: string;
  IdCliente: number;
  EstadoMascota: boolean;
}
