import httpClient from "../api/httpClient";

const chatGeneralService = {
  async getHistorialReciente(take = 50) {
    const { data } = await httpClient.get("/api/ChatGeneral/historial", {
      params: { take }
    });
    return Array.isArray(data) ? data : [];
  }
};

export default chatGeneralService;
