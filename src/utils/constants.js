export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7175";

export const APP_NAME = "VetCare";
export const AUTH_STORAGE_KEY = "vetcare_auth_session";

export const ROLE_IDS = {
  ADMIN: 1,
  VETERINARIO: 2,
  RECEPCIONISTA: 3
};

export const ROLE_NAMES = {
  [ROLE_IDS.ADMIN]: "Administrador",
  [ROLE_IDS.VETERINARIO]: "Veterinario",
  [ROLE_IDS.RECEPCIONISTA]: "Recepcionista"
};
