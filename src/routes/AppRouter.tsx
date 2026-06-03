import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ClientesListPage from "../pages/clientes/ClientesListPage";
import ClientesCreatePage from "../pages/clientes/ClientesCreatePage";
import ClientesEditPage from "../pages/clientes/ClientesEditPage";
import MascotasListPage from "../pages/mascotas/MascotasListPage";
import MascotasCreatePage from "../pages/mascotas/MascotasCreatePage";
import MascotasEditPage from "../pages/mascotas/MascotasEditPage";
import CitasListPage from "../pages/citas/CitasListPage";
import CitasCreatePage from "../pages/citas/CitasCreatePage";
import CitasEditPage from "../pages/citas/CitasEditPage";
import CitasDetailPage from "../pages/citas/CitasDetailPage";
import EstadoCitasListPage from "../pages/estadoCitas/EstadoCitasListPage";
import EstadoCitasCreatePage from "../pages/estadoCitas/EstadoCitasCreatePage";
import EstadoCitasEditPage from "../pages/estadoCitas/EstadoCitasEditPage";
import RolesListPage from "../pages/roles/RolesListPage";
import RolesCreatePage from "../pages/roles/RolesCreatePage";
import RolesEditPage from "../pages/roles/RolesEditPage";
import UsuariosListPage from "../pages/usuarios/UsuariosListPage";
import UsuariosCreatePage from "../pages/usuarios/UsuariosCreatePage";
import UsuariosEditPage from "../pages/usuarios/UsuariosEditPage";
import HistorialClinicoListPage from "../pages/historialClinico/HistorialClinicoListPage";
import HistorialClinicoCreatePage from "../pages/historialClinico/HistorialClinicoCreatePage";
import HistorialClinicoEditPage from "../pages/historialClinico/HistorialClinicoEditPage";
import HistorialClinicoDetailPage from "../pages/historialClinico/HistorialClinicoDetailPage";
import ChatGeneralPage from "../pages/chatGeneral/ChatGeneralPage";
import { ROLE_IDS } from "../utils/constants";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sin-acceso" element={<UnauthorizedPage />} />

      <Route
        path="/citas/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA]}>
            <CitasDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/historial-clinico/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA]}>
            <HistorialClinicoDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />

        <Route path="clientes" element={<ClientesListPage />} />
        <Route
          path="clientes/crear"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN, ROLE_IDS.RECEPCIONISTA]}>
              <ClientesCreatePage />
            </ProtectedRoute>
          }
        />
        <Route path="clientes/:id/editar" element={<ClientesEditPage />} />

        <Route path="mascotas" element={<MascotasListPage />} />
        <Route
          path="mascotas/crear"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN, ROLE_IDS.RECEPCIONISTA]}>
              <MascotasCreatePage />
            </ProtectedRoute>
          }
        />
        <Route path="mascotas/:id/editar" element={<MascotasEditPage />} />

        <Route path="citas" element={<CitasListPage />} />
        <Route path="citas/crear" element={<CitasCreatePage />} />
        <Route path="citas/:id/editar" element={<CitasEditPage />} />

        <Route path="estado-citas" element={<EstadoCitasListPage />} />
        <Route
          path="estado-citas/crear"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
              <EstadoCitasCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="estado-citas/:id/editar"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
              <EstadoCitasEditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="roles"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
              <RolesListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles/crear"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
              <RolesCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles/:id/editar"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
              <RolesEditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="usuarios"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
              <UsuariosListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="usuarios/crear"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
              <UsuariosCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="usuarios/:id/editar"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
              <UsuariosEditPage />
            </ProtectedRoute>
          }
        />

        <Route path="historial-clinico" element={<HistorialClinicoListPage />} />
        <Route
          path="historial-clinico/crear"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO]}>
              <HistorialClinicoCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="historial-clinico/:id/editar"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO]}>
              <HistorialClinicoEditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="chat-general"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN, ROLE_IDS.VETERINARIO, ROLE_IDS.RECEPCIONISTA]}>
              <ChatGeneralPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;
