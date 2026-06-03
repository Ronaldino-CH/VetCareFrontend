export interface ChatMessage {
  idMensaje: number | null;
  idUsuario: number | null;
  nombreUsuario: string;
  rolNombre: string;
  mensaje: string;
  fechaEnvio: string;
}

export interface ChatToast {
  id: string;
  nombreUsuario: string;
  mensaje: string;
}
