import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ClientesListPage from "../features/clientes/pages/ClientesListPage";
import ClientesCreatePage from "../features/clientes/pages/ClientesCreatePage";
import ClientesEditPage from "../features/clientes/pages/ClientesEditPage";
import ClientesDetailPage from "../features/clientes/pages/ClientesDetailPage";
import MascotasListPage from "../features/mascotas/pages/MascotasListPage";
import MascotasCreatePage from "../features/mascotas/pages/MascotasCreatePage";
import MascotasEditPage from "../features/mascotas/pages/MascotasEditPage";
import MascotasDetailPage from "../features/mascotas/pages/MascotasDetailPage";
import CitasListPage from "../features/citas/pages/CitasListPage";
import CitasCreatePage from "../features/citas/pages/CitasCreatePage";
import CitasEditPage from "../features/citas/pages/CitasEditPage";
import CitasDetailPage from "../features/citas/pages/CitasDetailPage";
import EstadoCitasListPage from "../features/estadoCitas/pages/EstadoCitasListPage";
import EstadoCitasCreatePage from "../features/estadoCitas/pages/EstadoCitasCreatePage";
import EstadoCitasEditPage from "../features/estadoCitas/pages/EstadoCitasEditPage";
import EstadoCitasDetailPage from "../features/estadoCitas/pages/EstadoCitasDetailPage";
import RolesListPage from "../features/roles/pages/RolesListPage";
import RolesCreatePage from "../features/roles/pages/RolesCreatePage";
import RolesEditPage from "../features/roles/pages/RolesEditPage";
import RolesDetailPage from "../features/roles/pages/RolesDetailPage";
import UsuariosListPage from "../features/usuarios/pages/UsuariosListPage";
import UsuariosCreatePage from "../features/usuarios/pages/UsuariosCreatePage";
import UsuariosEditPage from "../features/usuarios/pages/UsuariosEditPage";
import UsuariosDetailPage from "../features/usuarios/pages/UsuariosDetailPage";
import HistorialClinicoListPage from "../features/historialClinico/pages/HistorialClinicoListPage";
import HistorialClinicoCreatePage from "../features/historialClinico/pages/HistorialClinicoCreatePage";
import HistorialClinicoEditPage from "../features/historialClinico/pages/HistorialClinicoEditPage";
import HistorialClinicoDetailPage from "../features/historialClinico/pages/HistorialClinicoDetailPage";
import ChatGeneralPage from "../features/chatGeneral/pages/ChatGeneralPage";
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
        <Route path="clientes/:id" element={<ClientesDetailPage />} />

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
        <Route path="mascotas/:id" element={<MascotasDetailPage />} />

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
        <Route path="estado-citas/:id" element={<EstadoCitasDetailPage />} />

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
          path="roles/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
              <RolesDetailPage />
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
        <Route
          path="usuarios/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLE_IDS.ADMIN]}>
              <UsuariosDetailPage />
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
