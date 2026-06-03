import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useChatGeneral } from "../../hooks/useChatGeneral";
import { formatDateTime12 } from "../../utils/format";

function ChatGeneralPage() {
  const { user } = useAuth();
  const { mensajes, loading, error, status, sendMessage, markChatOpen } = useChatGeneral();
  const [texto, setTexto] = useState("");
  const [sending, setSending] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    markChatOpen(true);
    return () => {
      markChatOpen(false);
    };
  }, [markChatOpen]);

  const canSend = useMemo(() => texto.trim().length > 0 && !sending, [texto, sending]);

  useEffect(() => {
    const node = messagesRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [mensajes.length]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextText = texto.trim();
    if (!nextText) return;

    try {
      setSending(true);
      await sendMessage(nextText);
      setTexto("");
    } catch (err: any) {
      // El error global de conexion ya se muestra en pantalla.
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="page chat-page">
      <div className="chat-header">
        <div>
          <h2>Chat General Interno</h2>
          <p>Canal unico para Administrador, Veterinario y Recepcionista.</p>
        </div>
        <span className={`chat-status ${status === "Conectado" ? "online" : "offline"}`}>{status}</span>
      </div>

      {error ? <p className="error">{error}</p> : null}
      {loading ? <p>Cargando historial...</p> : null}

      <div ref={messagesRef} className="chat-messages" role="log" aria-live="polite">
        {!loading && mensajes.length === 0 ? <p className="chat-empty">No hay mensajes aun.</p> : null}

        {mensajes.map((msg, index) => {
          const key = msg.idMensaje || `msg-${index}`;
          const isOwn = String(msg.idUsuario) === String(user?.idUsuario);

          return (
            <article key={key} className={`chat-message ${isOwn ? "own" : ""}`}>
              <header>
                <strong>{msg.nombreUsuario}</strong>
                <span className="chat-role">{msg.rolNombre}</span>
                <time>{formatDateTime12(msg.fechaEnvio)}</time>
              </header>
              <p>{msg.mensaje}</p>
            </article>
          );
        })}
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder="Escribe un mensaje para el chat general..."
          maxLength={1000}
        />
        <button type="submit" className="primary-btn" disabled={!canSend}>
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </section>
  );
}

export default ChatGeneralPage;
