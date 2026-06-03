import { Link, useNavigate, useParams } from "react-router-dom";
import RolesForm from "../components/RolesForm";
import { useRolForm } from "../hooks/useRolForm";

function RolesEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { form, loading, saving, error, success, onChange, submit } = useRolForm({
    id: params.id,
    isEdit: true
  });

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) {
      setTimeout(() => {
        navigate("/roles");
      }, 600);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Roles - Editar</h2>
        <Link className="secondary-btn" to="/roles">
          Volver al listado
        </Link>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      {!loading ? (
        <RolesForm values={form} onChange={onChange} onSubmit={handleSubmit} saving={saving} submitLabel="Actualizar" />
      ) : null}
    </section>
  );
}

export default RolesEditPage;
