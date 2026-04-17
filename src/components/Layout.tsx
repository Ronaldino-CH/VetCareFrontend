import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import vetcareLogo from "../assets/vetcare.png";
import { APP_NAME } from "../utils/constants";
import { getModulesMenuByRole } from "../models/modulesConfig";
import { useAuth } from "../hooks/useAuth";

const menuIcons = {
  home: "🏠",
  clientes: "👤",
  mascotas: "🐾",
  citas: "📅",
  historialClinico: "🩺",
  estadoCitas: "🏷️",
  roles: "🛡️",
  usuarios: "👥"
};

const configurationKeys = ["estadoCitas", "roles", "usuarios"];

function Layout() {
  const location = useLocation();
  const { user, roleId, logout } = useAuth();
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

  return (
    <div className="app-shell">
      <div className="app-frame">
        <aside className="sidebar">
          <div className="avatar-card">
            <img src={vetcareLogo} alt="VetCare" className="avatar-logo" />
          </div>

          <nav>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active-link" : "")}>
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
                  <span>⚙️</span>
                  <span>Configuración</span>
                  <span className="menu-group-caret">{isConfigOpen ? "▾" : "▸"}</span>
                </button>

                {isConfigOpen ? (
                  <div className="menu-group-items">
                    {configurationModules.map((item) => (
                      <NavLink key={item.key} to={item.path} className={({ isActive }) => (isActive ? "active-link" : "")}>
                        <span>{menuIcons[item.key] || "•"}</span>
                        <span>{item.title}</span>
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {regularModules.map((item) => (
              <NavLink key={item.key} to={item.path} className={({ isActive }) => (isActive ? "active-link" : "")}>
                <span>{menuIcons[item.key] || "•"}</span>
                <span>{item.title}</span>
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
                Cerrar sesión
              </button>
            </div>
          </header>

          <main className="content">
            <Outlet />
          </main>
        </section>
      </div>

      <div className="app-footer-brand">{APP_NAME}</div>
    </div>
  );
}

export default Layout;
