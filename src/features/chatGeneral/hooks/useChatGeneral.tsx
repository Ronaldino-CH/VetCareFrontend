import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../../../hooks/useAuth";
import type { ChatMessage, ChatToast } from "../../../models/entities/chatMessage";
import { chatGeneralService } from "../../../services";
import chatHubService from "../../../services/chatHubService";
import { resolveFieldValue } from "../../../utils/format";

type ChatGeneralContextType = {
  mensajes: ChatMessage[];
  loading: boolean;
  status: string;
  error: string;
  unreadCount: number;
  toast: ChatToast | null;
  sendMessage: (mensaje: string) => Promise<void>;
  markChatOpen: (isOpen: boolean) => void;
  dismissToast: () => void;
};

const ChatGeneralContext = createContext<ChatGeneralContextType | null>(null);

function normalizeMessage(raw: any): ChatMessage {
  return {
    idMensaje: resolveFieldValue(raw, "idMensaje") ?? null,
    idUsuario: resolveFieldValue(raw, "idUsuario") ?? null,
    nombreUsuario: resolveFieldValue(raw, "nombreUsuario") || "Usuario",
    rolNombre: resolveFieldValue(raw, "rolNombre") || "Sin rol",
    mensaje: resolveFieldValue(raw, "mensaje") || "",
    fechaEnvio: resolveFieldValue(raw, "fechaEnvio") || ""
  };
}

export function ChatGeneralProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, accessToken, user } = useAuth();
  const [mensajes, setMensajes] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Desconectado");
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState<ChatToast | null>(null);
  const isChatOpenRef = useRef(false);
  const currentUserIdRef = useRef<number | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    currentUserIdRef.current = user?.idUsuario ?? null;
  }, [user?.idUsuario]);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const markChatOpen = useCallback((isOpen: boolean) => {
    isChatOpenRef.current = isOpen;
    if (isOpen) {
      setUnreadCount(0);
      setToast(null);
    }
  }, []);

  const scheduleToastHide = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => {
    let mounted = true;

    const connectGlobalChat = async () => {
      if (!isAuthenticated || !accessToken) {
        setMensajes([]);
        setUnreadCount(0);
        setToast(null);
        setError("");
        setStatus("Desconectado");
        await chatHubService.disconnect();
        return;
      }

      try {
        setLoading(true);
        setError("");
        setStatus("Conectando...");

        const historial = await chatGeneralService.getHistorialReciente(80);
        if (!mounted) return;
        setMensajes(historial.map(normalizeMessage));

        await chatHubService.connect(accessToken, (rawMessage) => {
          if (!mounted) return;

          const message = normalizeMessage(rawMessage);
          setMensajes((prev) => [...prev, message]);

          const isOwnMessage = String(message.idUsuario) === String(currentUserIdRef.current);
          if (!isOwnMessage && !isChatOpenRef.current) {
            setUnreadCount((prev) => prev + 1);
            setToast({
              id: String(message.idMensaje ?? Date.now()),
              nombreUsuario: message.nombreUsuario,
              mensaje: message.mensaje
            });
            scheduleToastHide();
          }
        });

        if (mounted) setStatus("Conectado");
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.response?.data?.message || err?.message || "No se pudo conectar al chat general.");
        setStatus("Desconectado");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    connectGlobalChat();

    return () => {
      mounted = false;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [isAuthenticated, accessToken, scheduleToastHide]);

  const sendMessage = useCallback(async (mensaje: string) => {
    await chatHubService.sendMessage(mensaje);
  }, []);

  const value = useMemo(
    () => ({
      mensajes,
      loading,
      status,
      error,
      unreadCount,
      toast,
      sendMessage,
      markChatOpen,
      dismissToast
    }),
    [mensajes, loading, status, error, unreadCount, toast, sendMessage, markChatOpen, dismissToast]
  );

  return <ChatGeneralContext.Provider value={value}>{children}</ChatGeneralContext.Provider>;
}

export function useChatGeneral() {
  const context = useContext(ChatGeneralContext);
  if (!context) throw new Error("useChatGeneral debe usarse dentro de ChatGeneralProvider");
  return context;
}
