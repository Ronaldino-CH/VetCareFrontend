import { createContext, useContext, useMemo, useState } from "react";
import { AUTH_STORAGE_KEY, ROLE_NAMES } from "../utils/constants";
import { authService } from "../services";

const AuthContext = createContext(null);

function parseStoredAuth() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(parseStoredAuth);

  const login = async ({ userName, password }) => {
    const response = await authService.login(userName, password);

    const nextSession = {
      accessToken: response.accessToken,
      expiresAtUtc: response.expiresAtUtc,
      user: {
        idUsuario: response.idUsuario,
        userName: response.userName,
        nombres: response.nombres,
        apellidos: response.apellidos,
        idRol: response.idRol,
        rolNombre: response.rolNombre || ROLE_NAMES[response.idRol] || "Sin rol"
      }
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);

    return nextSession;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session?.accessToken),
      accessToken: session?.accessToken || "",
      user: session?.user || null,
      roleId: session?.user?.idRol || null,
      login,
      logout
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
