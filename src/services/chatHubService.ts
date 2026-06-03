import * as signalR from "@microsoft/signalr";
import { API_BASE_URL } from "../utils/constants";

class ChatHubService {
  private connection: signalR.HubConnection | null = null;

  async connect(accessToken: string, onReceiveMessage: (message: any) => void) {
    if (!accessToken) throw new Error("No existe token de autenticacion para conectar el chat.");

    if (this.connection) {
      this.connection.off("ReceiveMessage");
      this.connection.on("ReceiveMessage", onReceiveMessage);
      if (this.connection.state === signalR.HubConnectionState.Connected) return;
    } else {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}/hubs/chat-general`, {
          accessTokenFactory: () => accessToken
        })
        .withAutomaticReconnect()
        .build();

      this.connection.on("ReceiveMessage", onReceiveMessage);
    }

    await this.connection.start();
  }

  async sendMessage(mensaje: string) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error("El chat no esta conectado.");
    }

    await this.connection.invoke("SendMessage", { mensaje });
  }

  async disconnect() {
    if (!this.connection) return;
    this.connection.off("ReceiveMessage");
    await this.connection.stop();
    this.connection = null;
  }

  getState() {
    if (!this.connection) return signalR.HubConnectionState.Disconnected;
    return this.connection.state;
  }
}

const chatHubService = new ChatHubService();
export default chatHubService;
