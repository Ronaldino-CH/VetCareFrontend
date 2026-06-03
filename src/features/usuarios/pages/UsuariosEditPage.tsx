import { Link, useNavigate, useParams } from "react-router-dom";
import UsuariosForm from "../components/UsuariosForm";
import { useUsuarioForm } from "../hooks/useUsuarioForm";

function UsuariosEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { form, roles, loading, saving, error, success, onChange, submit } = useUsuarioForm({
    id: params.id,
    isEdit: true
  });

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) {
      setTimeout(() => {
        navigate("/usuarios");
      }, 600);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Usuarios - Editar</h2>
        <Link className="secondary-btn" to="/usuarios">
          Volver al listado
        </Link>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      {!loading ? (
        <UsuariosForm
          values={form}
          roles={roles}
          onChange={onChange}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Actualizar"
        />
      ) : null}
    </section>
  );
}

export default UsuariosEditPage;
