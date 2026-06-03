import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import vetcareLogo from "../assets/vetcare.png";
import { APP_NAME } from "../utils/constants";
import { getModulesMenuByRole } from "../models/modulesConfig";
import { useAuth } from "../hooks/useAuth";
import { useChatGeneral } from "../features/chatGeneral/hooks/useChatGeneral";

const menuIcons = {
  home: "\uD83C\uDFE0",
  clientes: "\uD83D\uDC64",
  mascotas: "\uD83D\uDC3E",
  citas: "\uD83D\uDCC5",
  historialClinico: "\uD83E\uDDBA",
  chatGeneral: "\uD83D\uDCAC",
  estadoCitas: "\uD83C\uDFF7\uFE0F",
  roles: "\uD83D\uDEE1\uFE0F",
  usuarios: "\uD83D\uDC65"
};

const configurationKeys = ["estadoCitas", "roles", "usuarios"];

function Layout() {
  const location = useLocation();
  const { user, roleId, logout } = useAuth();
  const { unreadCount, toast, dismissToast, markChatOpen } = useChatGeneral();
  const modulesMenu = getModulesMenuByRole(roleId);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const currentPath = location.pathname.split("/")[1];
  const currentModule = modulesMenu.find((item) => item.path === `/${currentPath}`);
  const headerTitle = currentModule?.title || "Dashboard";

  const configurationModules = useMemo(
    () => modulesMenu.filter((item) => configurationKeys.includes(item.key)),
    [modulesMenu]
  );
  const regularModules = useMemo(
    () => modulesMenu.filter((item) => !configurationKeys.includes(item.key)),
    [modulesMenu]
  );
  const isConfigurationActive = configurationModules.some((item) => item.path === `/${currentPath}`);

  useEffect(() => {
    const inChatGeneral = location.pathname.startsWith("/chat-general");
    markChatOpen(inChatGeneral);
  }, [location.pathname, markChatOpen]);

  return (
    <div className="app-shell">
      <div className="app-frame">
        <aside className="sidebar">
          <div className="avatar-card">
            <img src={vetcareLogo} alt="VetCare" className="avatar-logo" />
          </div>

          <nav>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active-link" : "") }>
              <span>{menuIcons.home}</span>
              <span>Dashboard</span>
            </NavLink>

            {configurationModules.length ? (
              <div className="menu-group">
                <button
                  type="button"
                  className={`menu-group-trigger ${isConfigurationActive ? "active-link" : ""}`}
                  onClick={() => setIsConfigOpen((prev) => !prev)}
                >
                  <span>{"\u2699\uFE0F"}</span>
                  <span>Configuracion</span>
                  <span className="menu-group-caret">{isConfigOpen ? "\u25BE" : "\u25B8"}</span>
                </button>

                {isConfigOpen ? (
                  <div className="menu-group-items">
                    {configurationModules.map((item) => (
                      <NavLink key={item.key} to={item.path} className={({ isActive }) => (isActive ? "active-link" : "") }>
                        <span>{menuIcons[item.key] || "\u2022"}</span>
                        <span>{item.title}</span>
                        {item.key === "chatGeneral" && unreadCount > 0 ? <span className="menu-badge">{unreadCount}</span> : null}
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {regularModules.map((item) => (
              <NavLink key={item.key} to={item.path} className={({ isActive }) => (isActive ? "active-link" : "") }>
                <span>{menuIcons[item.key] || "\u2022"}</span>
                <span>{item.title}</span>
                {item.key === "chatGeneral" && unreadCount > 0 ? <span className="menu-badge">{unreadCount}</span> : null}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="workspace">
          <header className="workspace-header">
            <h1>{headerTitle}</h1>
            <div className="workspace-user">
              <div>
                <strong>
                  {user?.nombres} {user?.apellidos}
                </strong>
                <small>{user?.rolNombre}</small>
              </div>
              <button className="secondary-btn" type="button" onClick={logout}>
                Cerrar sesion
              </button>
            </div>
          </header>

          <main className="content">
            <Outlet />
          </main>
        </section>
      </div>

      {toast ? (
        <div className="chat-toast" role="status">
          <button type="button" className="chat-toast-close" onClick={dismissToast}>
            x
          </button>
          <strong>Nuevo mensaje de {toast.nombreUsuario}</strong>
          <p>{toast.mensaje}</p>
        </div>
      ) : null}

      <div className="app-footer-brand">{APP_NAME}</div>
    </div>
  );
}

export default Layout;
