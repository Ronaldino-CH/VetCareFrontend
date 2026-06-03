export interface Cliente {
  IdCliente: number;
  Nombres: string;
  Apellidos: string;
  Documento: string;
  Telefono?: string;
  Correo?: string;
  Direccion?: string;
  EstadoCliente: boolean;
}
