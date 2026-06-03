import { Link, useNavigate, useParams } from "react-router-dom";
import HistorialClinicoForm from "../components/HistorialClinicoForm";
import { useHistorialClinicoForm } from "../hooks/useHistorialClinicoForm";

function HistorialClinicoEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { form, mascotas, veterinarios, loading, saving, error, success, onChange, submit } =
    useHistorialClinicoForm({
      id: params.id,
      isEdit: true
    });

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) {
      setTimeout(() => {
        navigate("/historial-clinico");
      }, 600);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Historial Clinico - Editar</h2>
        <Link className="secondary-btn" to="/historial-clinico">
          Volver al listado
        </Link>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      {!loading ? (
        <HistorialClinicoForm
          values={form}
          mascotas={mascotas}
          veterinarios={veterinarios}
          onChange={onChange}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Actualizar"
        />
      ) : null}
    </section>
  );
}

export default HistorialClinicoEditPage;
