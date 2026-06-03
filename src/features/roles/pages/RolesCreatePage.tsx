import { Link, useNavigate } from "react-router-dom";
import RolesForm from "../components/RolesForm";
import { useRolForm } from "../hooks/useRolForm";

function RolesCreatePage() {
  const navigate = useNavigate();
  const { form, loading, saving, error, success, onChange, submit } = useRolForm({
    id: undefined,
    isEdit: false
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
        <h2>Roles - Crear</h2>
        <Link className="secondary-btn" to="/roles">
          Volver al listado
        </Link>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      {!loading ? (
        <RolesForm values={form} onChange={onChange} onSubmit={handleSubmit} saving={saving} submitLabel="Crear" />
      ) : null}
    </section>
  );
}

export default RolesCreatePage;
