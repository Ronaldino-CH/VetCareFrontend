import httpClient from "../api/httpClient";

const authService = {
  async login(userName, password) {
    const { data } = await httpClient.post("/api/Auth/login", {
      userName,
      password
    });

    return data;
  }
};

export default authService;
