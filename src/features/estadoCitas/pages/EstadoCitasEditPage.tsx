import { Link, useNavigate, useParams } from "react-router-dom";
import EstadoCitasForm from "../components/EstadoCitasForm";
import { useEstadoCitaForm } from "../hooks/useEstadoCitaForm";

function EstadoCitasEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { form, loading, saving, error, success, onChange, submit } = useEstadoCitaForm({
    id: params.id,
    isEdit: true
  });

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) {
      setTimeout(() => {
        navigate("/estado-citas");
      }, 600);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Estado de Citas - Editar</h2>
        <Link className="secondary-btn" to="/estado-citas">
          Volver al listado
        </Link>
      </div>

      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      {!loading ? (
        <EstadoCitasForm
          values={form}
          onChange={onChange}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Actualizar"
        />
      ) : null}
    </section>
  );
}

export default EstadoCitasEditPage;
